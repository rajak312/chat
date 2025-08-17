import { useQuery } from "@tanstack/react-query";
import type { GetChatsResponseItem } from "../../types";
import { getChats } from "../request/chats";

export const useChats = () => {
  return useQuery<GetChatsResponseItem, Error>({
    queryKey: ["chats"],
    queryFn: getChats,
    staleTime: 1000 * 60,
  });
};
