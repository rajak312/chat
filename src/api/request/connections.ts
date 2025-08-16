import { api } from "../index";
import type { Connection } from "../../types/chat";

export const listConnections = async (): Promise<Connection[]> => {
  return (await api.get("connections")).data;
};

export const sendConnectionRequest = async (
  targetUsername: string
): Promise<Connection> => {
  return (await api.post("connections", { targetUsername })).data;
};

export const respondConnectionRequest = async (
  connectionId: string,
  status: "accepted" | "rejected"
): Promise<Connection> => {
  return (await api.patch(`connections/${connectionId}`, { status })).data;
};

export const removeConnection = async (connectionId: string): Promise<void> => {
  return (await api.delete(`connections/${connectionId}`)).data;
};
