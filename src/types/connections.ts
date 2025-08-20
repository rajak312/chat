import type { User } from "./user";

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  createdAt: string;
  user: User;
  connectedUser: User;
}
