import { abToBase64, base64ToArrayBuffer } from "./utils";

export async function deriveAesKeyFromEcdh(
  privateKey: CryptoKey,
  peerPublicKey: CryptoKey
) {
  const aesKey = await crypto.subtle.deriveKey(
    { name: "ECDH", public: peerPublicKey },
    privateKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return aesKey;
}

export async function encryptWithAesKey(aesKey: CryptoKey, plaintext: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder().encode(plaintext);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, enc);
  return {
    ciphertext: abToBase64(ct),
    iv: abToBase64(iv.buffer),
  };
}

export async function decryptWithAesKey(
  aesKey: CryptoKey,
  ciphertextB64: string,
  ivB64: string
) {
  const ct = base64ToArrayBuffer(ciphertextB64);
  const iv = base64ToArrayBuffer(ivB64);
  const ptBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    aesKey,
    ct
  );
  return new TextDecoder().decode(ptBuf);
}
