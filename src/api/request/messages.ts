import { api } from ".";
import type { SendMessageInput, Message as ChatMessage } from "../../types";

export const sendMessage = async (
  id: string,
  data: SendMessageInput
): Promise<ChatMessage> => {
  return (await api.post("/messages", data)).data;
};

export const getMessages = async (payload: {
  id?: string;
  cursor?: string;
  limit?: number;
}): Promise<ChatMessage[]> => {
  const { id, ...params } = payload;
  return (await api.get(`/messages/${id}`, { params })).data;
};

export const markMessageSeen = async (
  messageId: string
): Promise<ChatMessage> => {
  return (await api.post(`/messages/${messageId}/seen`)).data as ChatMessage;
};
