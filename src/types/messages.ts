import type { User } from "./user";

export interface Message {
  id: string;
  sender: { id: string; username: string };
  senderDeviceId: string;
  recipientDeviceId?: string;
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
}

export interface SendMessageInput {
  ciphertext: string;
  iv?: string;
  authTag?: string;
  contentType?: string;
  version?: string;
  roomId?: string;
  connectionId?: string;
}

export type GetMessagesResponse = Message[];
