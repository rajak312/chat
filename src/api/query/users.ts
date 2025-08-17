import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../request/users";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
}
