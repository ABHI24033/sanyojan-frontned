
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserProfileById } from "../api/profile";

export const useUserProfile = (userId) => {
  return useInfiniteQuery({
    queryKey: ["userProfile", userId],

    queryFn: ({ pageParam = null }) =>
      getUserProfileById(userId, pageParam),

    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextCursor || null;
    },

    enabled: !!userId,
    initialPageParam: null,
  });
};
