import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllEvents } from "../../api/event";

export const useEventList = ({ limit = 10 } = {}) => {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
        refetch
    } = useInfiniteQuery({
        queryKey: ["events", limit],
        queryFn: ({ pageParam = null }) => getAllEvents({ cursor: pageParam, limit }),
        getNextPageParam: (lastPage) => {
            // Return nextCursor if it exists, otherwise undefined (no more pages)
            return lastPage?.nextCursor || undefined;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Flatten all pages into a single array
    const events = data?.pages.flatMap((page) => page.data) || [];

    return {
        events,
        error,
        fetchNextPage,
        hasNextPage,
        isLoading: status === "pending",
        isFetching,
        isFetchingNextPage,
        refetch,
    };
};
