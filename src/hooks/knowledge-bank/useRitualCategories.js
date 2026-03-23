import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoryApi from "../../api/ritualCategory";

// Hook to fetch categories by religion
export const useCategoriesByReligion = (religion) => {
    return useQuery({
        queryKey: ["ritualCategories", religion],
        queryFn: () => categoryApi.getCategoriesByReligion(religion),
        enabled: !!religion,
        select: (data) => data.categories || [],
    });
};

// Hook to fetch all categories (Admin)
export const useAllCategories = () => {
    return useQuery({
        queryKey: ["ritualCategories", "all"],
        queryFn: categoryApi.getAllCategories,
        select: (data) => data.categories || [],
    });
};

// Hook for category mutations
export const useCategoryMutations = () => {
    const queryClient = useQueryClient();

    const createCategoryMutation = useMutation({
        mutationFn: categoryApi.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(["ritualCategories"]);
        },
        onError: (error) => {
            console.error("Failed to create category:", error);
        },
    });

    return {
        createCategory: createCategoryMutation.mutateAsync,
        isCreating: createCategoryMutation.isPending,
    };
};
