import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage, markMessageSeen } from "../request/messages";
import type { Message, SendMessageInput } from "../../types";

export function useMessages(id: string) {
  return useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessages({ id }),
  });
}

export function useSendMessage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["messages", id],
    mutationFn: (data: SendMessageInput) => sendMessage(id, data),
    onSuccess: (newMessage) => {
      queryClient.setQueryData<Message[]>(
        ["messages", newMessage.roomId ?? newMessage.connectionId],
        (old) => (old ? [...old, newMessage] : [newMessage])
      );
    },
  });
}

export function useMarkSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) => markMessageSeen(messageId),
    onSuccess: (_, messageId) => {
      // Optional: update cache to add current user to seenBy
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}
