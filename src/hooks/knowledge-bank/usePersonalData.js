import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMyPersonalData,
    createPersonalData,
    getPersonalDataById,
    updatePersonalData,
    deletePersonalData
} from "../../api/personalData";

/**
 * Hook to fetch user's personal data
 */
export const useMyPersonalData = () => {
    return useQuery({
        queryKey: ["personalData", "my"],
        queryFn: getMyPersonalData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook to fetch single personal data entry
 */
export const usePersonalData = (id) => {
    return useQuery({
        queryKey: ["personalData", id],
        queryFn: () => getPersonalDataById(id),
        enabled: !!id,
    });
};

/**
 * Hook for personal data mutations (Create, Update, Delete)
 */
export const usePersonalDataMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createPersonalData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personalData"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updatePersonalData(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personalData"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deletePersonalData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personalData"] });
        },
    });

    return {
        createPersonalData: createMutation.mutateAsync,
        updatePersonalData: updateMutation.mutateAsync,
        deletePersonalData: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
