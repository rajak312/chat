import type { Message } from "./messages";
import type { User } from "./user";

export type ConversationType = "connection" | "group";

export interface Conversation {
  id: string;
  type: ConversationType;
  participant?: User;
  createdAt: string;
  lastMessage?: Message;
}

export interface CreateConversationPayload {
  type: ConversationType;
  roomId?: string;
  connectionId?: string;
}

export type ConversationResponse = {
  conversations: Conversation[];
};
