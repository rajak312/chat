import { api } from "..";
import type { User } from "../../types";

export const getCurrentUser = async (): Promise<User> =>
  (await api.get("users/me")).data;
