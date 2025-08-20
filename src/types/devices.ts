export interface Device {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  publicKey: string;
  enabled: boolean;
}

export interface RegisterDevicePayload {
  name: string;
  publicKey: string;
}

export interface RegisterDeviceResponse {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  publicKey: string;
  enabled: boolean;
}
