import { api } from "./index";
import type { Conversation, ConversationResponse } from "../../types";

export const getConversations = async (): Promise<ConversationResponse> => {
  return (await api.get("conversations")).data;
};

export const getConversationById = async (
  id: string
): Promise<Conversation> => {
  return (await api.get(`conversations/${id}`)).data;
};
