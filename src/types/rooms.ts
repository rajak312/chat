import type { Message } from "./messages";
import type { User } from "./user";

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
