import { useQuery } from "@tanstack/react-query";
import { getConversationById, getConversations } from "../request/conversation";

export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    staleTime: 1000 * 60,
  });
};

export const useGetConversationsById = (id: string) =>
  useQuery({
    queryKey: ["conversations", id],
    queryFn: () => getConversationById(id),
    enabled: !!id,
  });
