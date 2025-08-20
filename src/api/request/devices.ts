import { api } from "..";
import type { Device, RegisterDevicePayload } from "../../types";

export const registerDevice = async (
  body: RegisterDevicePayload
): Promise<Device> => {
  return await api.post("devices/register", body);
};

export const getDevicesByUserId = async (userId: string) => {
  return (await api.get(`devices/users/${userId}`)).data;
};
