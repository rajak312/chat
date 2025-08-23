import type { Device } from "./devices";
import type { User } from "./user";

export interface WrappedKey {
  id: string;
  messageId: string; // FK → Message
  deviceId: string; // FK → Device
  encryptedKey: string; // Wrapped key for that device
  device?: Device;
}

export interface Message {
  id: string;
  sender: { id: string; username: string };
  senderDeviceId: string;
  connectionId?: string;
  roomId?: string;
  ciphertext: string;
  iv?: string;
  authTag?: string;
  contentType?: string;
  version?: string;
  createdAt: string;
  seenBy: { userId: string }[];
  senderEphemeralPublic?: string;

  // New field → every message may contain multiple wrapped keys
  wrappedKeys: WrappedKey[];
}

export interface MessageSeen {
  id: string;
  userId: string;
  messageId: string;
  at: string;
  user?: User;
}

export interface SendMessageRequest {
  ciphertext: string;
  iv?: string;
  authTag?: string;
  contentType?: string;
  version?: string;
  id: string;
  senderDeviceId: string;
  wrappedKeys: {
    deviceId: string;
    encryptedKey: string;
  }[];
}

export type GetMessagesResponse = Message[];
