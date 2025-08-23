import React, { createContext, useContext, useEffect, useState } from "react";
import { useRegisterDeviceMutation } from "../api/query/devices";
import type { Device } from "../types";
import {
  decryptHybrid,
  generateRsaPair,
  importPrivateKeyFromB64,
} from "../crypto";

export interface CryptoContextType {
  deviceInfo: Device | null;
  decryptText: (
    iv: string,
    ciphertext: string,
    encryptedKey: string
  ) => Promise<string | undefined>;
}

const CryptoContext = createContext<CryptoContextType | null>(null);

export const CryptoProvider = ({ children }: { children: React.ReactNode }) => {
  const [deviceInfo, setDeviceInfo] = useState<Device | null>(null);
  const [keys, setKeys] = useState<{ pub: string; priv: string } | null>(null);
  const registerMutation = useRegisterDeviceMutation();

  const registerDevice = async () => {
    try {
      const storedInfo = localStorage.getItem("CHAT_DEVICE_INFO");
      const storedKeys = localStorage.getItem("CHAT_DEVICE_KEYS");
      if (storedInfo && storedKeys) {
        const info = JSON.parse(storedInfo) as Device;
        setDeviceInfo(info);
        setKeys(JSON.parse(storedKeys));
        return;
      }

      const { pubB64, privB64 } = await generateRsaPair();
      const keys = { pub: pubB64, priv: privB64 };

      const deviceName = `web-${navigator.userAgent}`;
      registerMutation.mutate(
        { name: deviceName, publicKey: pubB64 },
        {
          onSuccess: (data) => {
            localStorage.setItem("CHAT_DEVICE_INFO", JSON.stringify(data));
            localStorage.setItem("CHAT_DEVICE_KEYS", JSON.stringify(keys));
            setDeviceInfo(data);
            setKeys(keys);
          },
        }
      );
    } catch (err) {
      console.error("[CryptoProvider] Device registration failed:", err);
    }
  };

  async function decryptText(
    iv: string,
    ciphertext: string,
    encryptedKey: string
  ): Promise<string | undefined> {
    if (!keys?.priv) return;
    const privKey = await importPrivateKeyFromB64(keys.priv);
    return await decryptHybrid(privKey, iv, ciphertext, encryptedKey);
  }

  useEffect(() => {
    registerDevice();
  }, []);

  return (
    <CryptoContext.Provider
      value={{
        deviceInfo,
        decryptText,
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
