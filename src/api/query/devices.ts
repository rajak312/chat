import { useMutation, useQuery } from "@tanstack/react-query";
import type { RegisterDevicePayload } from "../../types";
import { getDevicesByUserId, registerDevice } from "../request/devices";

export const useRegisterDeviceMutation = () => {
  return useMutation({
    mutationKey: ["devices", "register"],
    mutationFn: (payload: RegisterDevicePayload) => registerDevice(payload),
  });
};

export const useGetDevicesByUserId = (userId: string) =>
  useQuery({
    queryKey: ["devices", userId],
    queryFn: () => getDevicesByUserId(userId),
    enabled: !!userId,
  });
