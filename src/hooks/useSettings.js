import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSystemSettings, updateSystemSetting } from "../api/settings";

export const useSettings = () => {
    return useQuery({
        queryKey: ["systemSettings"],
        queryFn: getSystemSettings,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useSettingMutations = () => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: updateSystemSetting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["systemSettings"] });
        },
    });

    return {
        updateSetting: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
    };
};
