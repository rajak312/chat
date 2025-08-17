import type { Device } from "../../types";
import { api } from "./index";

export const getUserDevices = async (userId: string): Promise<Device[]> =>
  (await api.get(`/crypto/users/${userId}/devices`)).data;
