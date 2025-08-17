import React, { createContext, useContext, useEffect, useState } from "react";
import {
  generateIdentitySigningKeyPair,
  generateECDHKeyPair,
  signDataWithIdentity,
  importEcdhPublicFromBase64,
  importEcdsaPublicFromBase64,
  importPrivateJwk,
} from "../crypto/keys";
import {
  deriveAesKeyFromEcdh,
  encryptWithAesKey,
  decryptWithAesKey,
} from "../crypto/encryption";
import { base64ToArrayBuffer, abToBase64 } from "../crypto/utils";

type Session = {
  aesKey: CryptoKey;
  senderEphemeralPublicB64: string;
};

type CryptoContextType = {
  deviceId: string | null;
  ensureDeviceRegistered: () => Promise<void>;
  encryptAndPrepareMessage: (
    recipientDeviceId: string,
    plaintext: string
  ) => Promise<{
    ciphertext: string;
    iv: string;
    senderEphemeralPublic: string;
  }>;
  decryptReceivedMessage: (
    ciphertext: string,
    iv: string,
    senderEphemeralPublicB64: string
  ) => Promise<string>;
  createSessionWithDevice: (recipientDeviceId: string) => Promise<Session>;
};

const CryptoContext = createContext<CryptoContextType | null>(null);

export const CryptoProvider = ({ children }: { children: React.ReactNode }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [identityPrivate, setIdentityPrivate] = useState<CryptoKey | null>(
    null
  );
  const [signedPrekeyPrivate, setSignedPrekeyPrivate] =
    useState<CryptoKey | null>(null);

  // ------------------ SESSION CACHE ------------------
  const sessions = new Map<string, Session>();

  useEffect(() => {
    ensureDeviceRegistered();
  }, []);

  // ------------------ DEVICE REGISTRATION ------------------
  async function ensureDeviceRegistered() {
    const saved = localStorage.getItem("chat.crypto");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDeviceId(parsed.deviceId);
      const idPriv = await importPrivateJwk(parsed.identityPrivateJwk, "ECDSA");
      const spkPriv = await importPrivateJwk(
        parsed.signedPrekeyPrivateJwk,
        "ECDH"
      );
      setIdentityPrivate(idPriv);
      setSignedPrekeyPrivate(spkPriv);
      return; // ✅ don't register again
    }

    // Only generate and register if not already in localStorage
    const identity = await generateIdentitySigningKeyPair();
    const signedPre = await generateECDHKeyPair();
    const identityPrivKey = await importPrivateJwk(
      identity.privateJwk,
      "ECDSA"
    );
    const spkSignature = await signDataWithIdentity(
      identityPrivKey,
      base64ToArrayBuffer(signedPre.publicSpkiB64)
    );

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/crypto/devices`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `web-${navigator.userAgent}`,
          identityKey: identity.publicSpkiB64,
          signedPreKey: signedPre.publicSpkiB64,
          spkSignature,
        }),
      }
    );
    const registerJson = await res.json();
    const createdDeviceId =
      registerJson.id ||
      registerJson.deviceId ||
      registerJson.data?.id ||
      registerJson.data?.deviceId;
    if (!createdDeviceId) throw new Error("Device registration failed");

    // persist locally
    localStorage.setItem(
      "chat.crypto",
      JSON.stringify({
        deviceId: createdDeviceId,
        identityPrivateJwk: identity.privateJwk,
        signedPrekeyPrivateJwk: signedPre.privateJwk,
      })
    );

    setDeviceId(createdDeviceId);
    setIdentityPrivate(identityPrivKey);
    setSignedPrekeyPrivate(
      await importPrivateJwk(signedPre.privateJwk, "ECDH")
    );
  }

  // ------------------ CREATE SESSION ------------------
  async function createSessionWithDevice(
    recipientDeviceId: string
  ): Promise<Session> {
    if (sessions.has(recipientDeviceId))
      return sessions.get(recipientDeviceId)!;
    if (!identityPrivate) throw new Error("Identity key missing");

    // Claim recipient prekey bundle
    const res = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/crypto/devices/${recipientDeviceId}/claim`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const bundle = await res.json();

    const identityPub = await importEcdsaPublicFromBase64(bundle.identityKey);
    const spkPubAb = base64ToArrayBuffer(bundle.signedPreKey);
    const sigBytes = base64ToArrayBuffer(bundle.spkSignature);
    const ok = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      identityPub,
      sigBytes,
      spkPubAb
    );
    if (!ok) throw new Error("Signed prekey signature invalid");

    const senderEphemeral = await crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey"]
    );
    const recipientSpkPub = await importEcdhPublicFromBase64(
      bundle.signedPreKey
    );
    const aesKey = await deriveAesKeyFromEcdh(
      senderEphemeral.privateKey,
      recipientSpkPub
    );
    const senderEphemeralPubSpki = await crypto.subtle.exportKey(
      "spki",
      senderEphemeral.publicKey
    );
    const session: Session = {
      aesKey,
      senderEphemeralPublicB64: abToBase64(senderEphemeralPubSpki),
    };
    sessions.set(recipientDeviceId, session);
    return session;
  }

  // ------------------ ENCRYPT MESSAGE ------------------
  async function encryptAndPrepareMessage(
    recipientDeviceId: string,
    plaintext: string
  ) {
    const session = await createSessionWithDevice(recipientDeviceId);
    const { ciphertext, iv } = await encryptWithAesKey(
      session.aesKey,
      plaintext
    );
    return {
      ciphertext,
      iv,
      senderEphemeralPublic: session.senderEphemeralPublicB64,
    };
  }

  // ------------------ DECRYPT MESSAGE ------------------
  async function decryptReceivedMessage(
    ciphertext: string,
    iv: string,
    senderEphemeralPublicB64: string
  ) {
    if (!signedPrekeyPrivate) throw new Error("Signed prekey missing");
    const senderPub = await importEcdhPublicFromBase64(
      senderEphemeralPublicB64
    );
    const aesKey = await deriveAesKeyFromEcdh(signedPrekeyPrivate, senderPub);
    return decryptWithAesKey(aesKey, ciphertext, iv);
  }

  return (
    <CryptoContext.Provider
      value={{
        deviceId,
        ensureDeviceRegistered,
        encryptAndPrepareMessage,
        decryptReceivedMessage,
        createSessionWithDevice,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const ctx = useContext(CryptoContext);
  if (!ctx) throw new Error("useCrypto must be inside CryptoProvider");
  return ctx;
};
