import { useQuery } from "@tanstack/react-query";
import { getUpcomingCelebrations } from "../api/profile";

export const useCelebrations = () => {
    const celebrationsQuery = useQuery({
        queryKey: ['celebrations'],
        queryFn: getUpcomingCelebrations,
        staleTime: 5 * 60 * 1000, // Refresh every 5 minutes
        gcTime: 10 * 60 * 1000, // Cache for 10 minutes
        retry: 2
    });

    return {
        celebrationsQuery,
        birthdays: celebrationsQuery.data?.birthdays || [],
        anniversaries: celebrationsQuery.data?.anniversaries || [],
        deathAnniversaries: celebrationsQuery.data?.deathAnniversaries || [],
        isLoading: celebrationsQuery.isLoading,
        error: celebrationsQuery.error
    };
};
