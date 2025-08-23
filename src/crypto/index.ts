import type { Device, EncryptResponse } from "../types";

export function ab2b64(buf: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunkSize = 0x8000; // process in chunks to avoid stack overflow
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export function b642ab(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function normalizeB64(s: string): string {
  if (!s) return s;
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4;
  if (pad) s += "===".slice(pad);
  return s;
}

// ---------- Key import/export ----------
export async function importPublicKeyFromB64(
  spkiB64: string
): Promise<CryptoKey> {
  const ab = b642ab(normalizeB64(spkiB64)).buffer;
  return crypto.subtle.importKey(
    "spki",
    ab,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt", "wrapKey"]
  );
}

export async function importPrivateKeyFromB64(
  pkcs8B64: string
): Promise<CryptoKey> {
  const ab = b642ab(normalizeB64(pkcs8B64)).buffer;
  return crypto.subtle.importKey(
    "pkcs8",
    ab,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt", "unwrapKey"]
  );
}

export async function generateRsaPair() {
  const kp = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
  );
  const pub = await crypto.subtle.exportKey("spki", kp.publicKey);
  const priv = await crypto.subtle.exportKey("pkcs8", kp.privateKey);
  return {
    keyPair: kp,
    pubB64: ab2b64(pub),
    privB64: ab2b64(priv),
  };
}

export async function encryptHybrid(
  plaintext: string,
  devices: Device[]
): Promise<EncryptResponse> {
  // 1. Generate AES-GCM session key
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // 2. Random IV (12 bytes)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // 3. Encrypt plaintext with AES-GCM
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, data);

  // 4. Wrap AES key with each device’s RSA public key
  const wrappedKeys = await Promise.all(
    devices.map(async (device) => {
      const key = await importPublicKeyFromB64(device.publicKey);
      const wrappedKey = await crypto.subtle.wrapKey("raw", aesKey, key, {
        name: "RSA-OAEP",
      });

      return {
        deviceId: device.id,
        encryptedKey: ab2b64(wrappedKey),
      };
    })
  );

  // 5. Debug logs
  console.log("🔐 ENCRYPT DEBUG");
  console.log({
    plaintext,
    encodedText: data,
    iv,
    ivBase64: ab2b64(iv.buffer),
    ivDecodedBack: b642ab(ab2b64(iv.buffer)),
    ciphertext: ct,
    ciphertextLength: (ct as ArrayBuffer).byteLength,
    ciphertextBase64: ab2b64(ct),
    wrappedKeys,
  });

  // 6. Return everything encoded
  return {
    iv: ab2b64(iv.buffer),
    ciphertext: ab2b64(ct),
    wrappedKeys,
  };
}

// ---------- Hybrid Decrypt ----------
export async function decryptHybrid(
  privKey: CryptoKey,
  iv: string,
  ciphertext: string,
  encryptedKey: string
): Promise<string> {
  const _iv = b642ab(normalizeB64(iv));
  const ct = b642ab(normalizeB64(ciphertext)).buffer;
  const wrappedAb = b642ab(normalizeB64(encryptedKey)).buffer;

  console.log("decryptHybrid debug:", {
    iv,
    ciphertext,
    ivLength: _iv.byteLength,
    ciphertextByteLength: ct.byteLength ?? (ct as any).byteLength,
    wrappedByteLength: wrappedAb.byteLength,
    privKey,
  });

  try {
    const aesKey = await crypto.subtle.unwrapKey(
      "raw",
      wrappedAb,
      privKey,
      { name: "RSA-OAEP" },
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const ptBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: _iv },
      aesKey,
      ct
    );
    return new TextDecoder().decode(ptBuf);
  } catch (err) {
    console.error("decryptHybrid failed:", err);
    throw err;
  }
}
