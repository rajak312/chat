import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listConnections,
  sendConnectionRequest,
  respondConnectionRequest,
  removeConnection,
} from "../request/connections";
import type { Connection } from "../../types";

export function useConnections() {
  return useQuery<Connection[]>({
    queryKey: ["connections"],
    queryFn: listConnections,
  });
}

export function useSendConnectionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (targetUsername: string) =>
      sendConnectionRequest(targetUsername),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
}

export function useRespondConnectionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      requestId: string;
      status: "accepted" | "rejected";
    }) => respondConnectionRequest(data.requestId, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
}

export function useRemoveConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: string) => removeConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });
}
