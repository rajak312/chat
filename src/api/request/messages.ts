import { api } from ".";
import type { SendMessageInput, Message as ChatMessage } from "../../types";

export const sendMessage = async (
  data: SendMessageInput
): Promise<ChatMessage> => {
  return (await api.post("/messages", data)).data;
};

export const getMessages = async (params: {
  roomId?: string;
  connectionId?: string;
  cursor?: string;
  limit?: number;
}): Promise<ChatMessage[]> => {
  return (await api.get("/messages", { params })).data;
};

export const markMessageSeen = async (
  messageId: string
): Promise<ChatMessage> => {
  return (await api.post(`/messages/${messageId}/seen`)).data as ChatMessage;
};
