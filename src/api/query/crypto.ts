import { useQuery } from "@tanstack/react-query";
import { getUserDevices } from "../request/crypto";

export function useGetUserDevices(userId: string) {
  return useQuery({
    queryKey: ["crypto", "users", userId],
    queryFn: () => getUserDevices(userId),
    enabled: !!userId,
  });
}
