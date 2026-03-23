import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getContactGroups,
    createContactGroup,
    updateContactGroup,
    deleteContactGroup,
    getContactGroupById
} from "../../api/group";

export const useGroups = () => {
    const queryClient = useQueryClient();

    // Fetch all groups
    const groupsQuery = useQuery({
        queryKey: ["contact-groups"],
        queryFn: getContactGroups,
    });

    // Create group mutation
    const createGroupMutation = useMutation({
        mutationFn: createContactGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
        },
    });

    // Update group mutation
    const updateGroupMutation = useMutation({
        mutationFn: ({ id, data }) => updateContactGroup(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
        },
    });

    // Delete group mutation
    const deleteGroupMutation = useMutation({
        mutationFn: deleteContactGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
        },
    });

    return {
        groups: groupsQuery.data?.data || [],
        isLoading: groupsQuery.isLoading,
        error: groupsQuery.error,
        createGroup: createGroupMutation.mutateAsync,
        updateGroup: updateGroupMutation.mutateAsync,
        deleteGroup: deleteGroupMutation.mutateAsync,
        isCreating: createGroupMutation.isPending,
        isUpdating: updateGroupMutation.isPending,
        isDeleting: deleteGroupMutation.isPending,
    };
};

export const useGroup = (id) => {
    return useQuery({
        queryKey: ["contact-group", id],
        queryFn: () => getContactGroupById(id),
        enabled: !!id,
    });
};
