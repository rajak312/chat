import { abToBase64, base64ToArrayBuffer } from "./utils";

/**
 * Identity Key (ECDSA P-256) -> used to sign the signedPreKey
 * SignedPreKey & OneTimePreKey (ECDH P-256) -> used for key agreement
 */

export async function generateIdentitySigningKeyPair() {
  const kp = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true, // extractable because we must persist (for demo). For prod, consider secure storage.
    ["sign", "verify"]
  );

  const pubSpki = await crypto.subtle.exportKey("spki", kp.publicKey);
  const pubB64 = abToBase64(pubSpki);
  const privJwk = await crypto.subtle.exportKey("jwk", kp.privateKey); // storeable JSON

  return { keyPair: kp, publicSpkiB64: pubB64, privateJwk: privJwk };
}

export async function generateECDHKeyPair() {
  const kp = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );
  const pubSpki = await crypto.subtle.exportKey("spki", kp.publicKey);
  const pubB64 = abToBase64(pubSpki);
  const privateJwk = await crypto.subtle.exportKey("jwk", kp.privateKey);
  return { keyPair: kp, publicSpkiB64: pubB64, privateJwk };
}

export async function signDataWithIdentity(
  privateKey: CryptoKey,
  data: ArrayBuffer
) {
  // ECDSA P-256 + SHA-256
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    privateKey,
    data
  );
  return abToBase64(sig);
}

export async function importEcdsaPublicFromBase64(spkiB64: string) {
  const ab = base64ToArrayBuffer(spkiB64);
  return crypto.subtle.importKey(
    "spki",
    ab,
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["verify"]
  );
}

export async function importEcdhPublicFromBase64(spkiB64: string) {
  const ab = base64ToArrayBuffer(spkiB64);
  return crypto.subtle.importKey(
    "spki",
    ab,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );
}

// Export/import private keys (JWK) for local persistence
export async function importPrivateJwk(jwk: JsonWebKey, alg: "ECDSA" | "ECDH") {
  if (alg === "ECDSA") {
    return crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign"]
    );
  } else {
    return crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey", "deriveBits"]
    );
  }
}
