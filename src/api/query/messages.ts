import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { getMessages, sendMessage, markMessageSeen } from "../request/messages";
import type { Message, SendMessageRequest } from "../../types";

export function useMessages(id: string, deviceId: string | null) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<Message[]>({
    queryKey: ["messages", id, deviceId],
    queryFn: () => getMessages({ id, deviceId }),
    enabled: !!(id && deviceId),
    initialPageParam: "",
    getNextPageParam: (lastPage) =>
      lastPage.length === 0 ? undefined : lastPage[lastPage.length - 1].id,
  });

  const addMessage = (message: Message) => {
    queryClient.setQueryData(["messages", id, deviceId], (old: any) => {
      if (!old) return { pages: [[message]], pageParams: [""] };
      return {
        ...old,
        pages: [[message, ...old.pages[0]], ...old.pages.slice(1)],
      };
    });
  };

  const updateMessageStatus = (tempId: string, newId: string) => {
    queryClient.setQueryData(["messages", id, deviceId], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page: Message[]) =>
          page.map((msg) =>
            msg.id === tempId ? { ...msg, id: newId, status: "sent" } : msg
          )
        ),
      };
    });
  };

  return { ...query, addMessage, updateMessageStatus };
}

export function useSendMessage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["messages", id],
    mutationFn: (data: SendMessageRequest) => sendMessage(id, data),
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
