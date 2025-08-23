export interface WrappedKeyPayload {
  deviceId: string;
  encryptedKey: string;
}

export interface EncryptResponse {
  iv: string;
  ciphertext: string;
  wrappedKeys: WrappedKeyPayload[];
}
