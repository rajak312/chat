import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage, markMessageSeen } from "../request/messages";
import type { Message, SendMessageInput } from "../../types";

export function useMessages(roomId?: string, connectionId?: string) {
  return useQuery({
    queryKey: ["messages", roomId ?? connectionId],
    queryFn: () => getMessages({ roomId, connectionId }),
    enabled: !!roomId || !!connectionId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendMessageInput) => sendMessage(data),
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
