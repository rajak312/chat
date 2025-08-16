export interface SendMessageInput {
  ciphertext: string;
  iv?: string;
  authTag?: string;
  contentType?: string;
  version?: string;
  roomId?: string; // for group
  connectionId?: string; // for 1-to-1
}

export interface Message {
  id: string;
  sender: { id: string; username: string };
  connectionId?: string;
  roomId?: string;
  ciphertext: string;
  iv?: string;
  authTag?: string;
  contentType?: string;
  version?: string;
  createdAt: string;
  seenBy: { userId: string }[];
}
