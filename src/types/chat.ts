import type { Message } from "./messages";

export interface User {
  id: string;
  username: string;
}

export interface ConnectionChat {
  id: string;
  type: "connection";
  participant: {
    id: string;
    username: string;
    online: boolean;
  };
  lastMessage: Message | null;
}

export interface GroupChat {
  id: string;
  type: "group";
  name: string;
  lastMessage: Message | null;
}

export type Chat = ConnectionChat | GroupChat;

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  createdAt: string;
  user: User;
  connectedUser: User;
}

export interface RoomUser {
  id: string;
  userId: string;
  roomId: string;
  encryptedRoomKey?: string;
  keyEnvelopeIV?: string;
  keyEnvelopeTag?: string;
  keyEnvelopeAlg?: string;
  deviceId?: string;
  user?: User;
}

export interface Room {
  id: string;
  name: string;
  isGroup: boolean;
  createdAt: string;
  roomUsers?: RoomUser[];
  messages?: Message[];
}

export interface MessageSeen {
  id: string;
  userId: string;
  messageId: string;
  at: string;
  user?: User;
}

export interface GetChatsResponseItem {
  chats: (ConnectionChat | GroupChat)[];
}

export interface GetMessagesResponse extends Array<Message> {}

export interface SendMessageRequest {
  ciphertext: string;
  iv?: string;
  authTag?: string;
  contentType?: string;
  version?: string;
}
