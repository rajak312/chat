import React, { createContext, useContext, useEffect, useState } from "react";
import { useRegisterDeviceMutation } from "../api/query/devices";
import type { Device } from "../types";
import {
  generateKeyPair,
  importPublicKey,
  encryptMessage,
  decryptMessage,
} from "../crypto";

type CryptoContextType = {
  deviceInfo: Device | null;
  encryptWithServer: (message: string, serverPubKey: string) => Promise<string>;
  decryptWithDevice: (ciphertext: string) => Promise<string>;
};

const CryptoContext = createContext<CryptoContextType | null>(null);

export const CryptoProvider = ({ children }: { children: React.ReactNode }) => {
  const [deviceInfo, setDeviceInfo] = useState<Device | null>(null);
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const registerMutation = useRegisterDeviceMutation();

  const registerDevice = async () => {
    try {
      const storedInfo = localStorage.getItem("CHAT_DEVICE_INFO");
      const storedPriv = localStorage.getItem("CHAT_DEVICE_PRIVATE_KEY");
      if (storedInfo && storedPriv) {
        setDeviceInfo(JSON.parse(storedInfo));
        const binary = Uint8Array.from(atob(storedPriv), (c) =>
          c.charCodeAt(0)
        );
        const key = await window.crypto.subtle.importKey(
          "pkcs8",
          binary.buffer,
          { name: "RSA-OAEP", hash: "SHA-256" },
          true,
          ["decrypt"]
        );
        setPrivateKey(key);
        return;
      }

      const keyPair = await generateKeyPair();

      const exportedPub = await crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
      );
      const exportedPriv = await crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
      );

      const pubB64 = btoa(String.fromCharCode(...new Uint8Array(exportedPub)));
      const privB64 = btoa(
        String.fromCharCode(...new Uint8Array(exportedPriv))
      );

      const deviceName = `web-${navigator.userAgent}`;
      registerMutation.mutate(
        {
          name: deviceName,
          publicKey: pubB64,
        },
        {
          onSuccess: (data) => {
            localStorage.setItem("CHAT_DEVICE_INFO", JSON.stringify(data));
            localStorage.setItem("CHAT_DEVICE_PRIVATE_KEY", privB64);
            setDeviceInfo(data);
            setPrivateKey(keyPair.privateKey);
          },
        }
      );
    } catch (err) {
      console.error("[CryptoProvider] Device registration failed:", err);
    }
  };

  useEffect(() => {
    registerDevice();
  }, []);

  const encryptWithServer = async (
    message: string,
    serverPubKey: string
  ): Promise<string> => {
    const pubKey = await importPublicKey(serverPubKey);
    return await encryptMessage(pubKey, message);
  };

  const decryptWithDevice = async (ciphertext: string): Promise<string> => {
    if (!privateKey) throw new Error("Private key not loaded");
    return await decryptMessage(privateKey, ciphertext);
  };

  return (
    <CryptoContext.Provider
      value={{
        deviceInfo,
        encryptWithServer,
        decryptWithDevice,
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
