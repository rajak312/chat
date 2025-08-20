export async function generateECDHKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"]
  );

  const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey,
    privateKey,
    raw: keyPair,
  };
}

export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return keyPair;
}

export async function importPublicKey(
  publicKeyB64: string
): Promise<CryptoKey> {
  const binary = Uint8Array.from(atob(publicKeyB64), (c) => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    "spki",
    binary.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

export async function encryptMessage(
  publicKey: CryptoKey,
  message: string
): Promise<string> {
  const encoded = new TextEncoder().encode(message);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    encoded
  );
  return btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
}

export async function decryptMessage(
  privateKey: CryptoKey,
  ciphertextB64: string
): Promise<string> {
  const binary = Uint8Array.from(atob(ciphertextB64), (c) => c.charCodeAt(0));
  const plaintext = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    binary.buffer
  );
  return new TextDecoder().decode(plaintext);
}
