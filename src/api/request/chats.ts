import { api } from ".";
import type { GetChatsResponseItem } from "../../types";

export const getChats = async (): Promise<GetChatsResponseItem> => {
  return (await api.get("chats")).data;
};
