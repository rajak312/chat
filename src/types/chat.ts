export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  ciphertext: string;
  contentType?: string;
  version?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  isGroup: boolean;
}
