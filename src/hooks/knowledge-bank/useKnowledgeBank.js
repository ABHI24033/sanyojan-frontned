import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMyKnowledgeBank,
    getAllKnowledgeBank,
    getKnowledgeBankById,
    createKnowledgeBank,
    updateKnowledgeBank,
    deleteKnowledgeBank
} from "../../api/knowledgeBank";

/**
 * Hook to fetch user's specific knowledge bank entries (based on their profile religion)
 */
export const useMyKnowledgeBank = () => {
    return useQuery({
        queryKey: ["knowledgeBank", "my"],
        queryFn: getMyKnowledgeBank,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

/**
 * Hook to fetch all knowledge bank entries (Admin view)
 */
export const useAdminKnowledgeBank = () => {
    return useQuery({
        queryKey: ["knowledgeBank", "admin"],
        queryFn: getAllKnowledgeBank,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook to fetch single knowledge bank entry details
 */
export const useKnowledgeBank = (id) => {
    return useQuery({
        queryKey: ["knowledgeBank", id],
        queryFn: () => getKnowledgeBankById(id),
        enabled: !!id,
    });
};

/**
 * Hook for knowledge bank mutations (Create, Update, Delete)
 */
export const useKnowledgeBankMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createKnowledgeBank,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["knowledgeBank"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updateKnowledgeBank(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["knowledgeBank"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteKnowledgeBank,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["knowledgeBank"] });
        },
    });

    return {
        createKnowledgeBank: createMutation.mutateAsync,
        updateKnowledgeBank: updateMutation.mutateAsync,
        deleteKnowledgeBank: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
