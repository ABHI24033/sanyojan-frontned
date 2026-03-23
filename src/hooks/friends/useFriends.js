import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyContacts, createContact, deleteContact } from "../../api/externalContact";

export const useFriends = (enabled = false) => {
    const queryClient = useQueryClient();

    const { data: contacts, isLoading, error } = useQuery({
        queryKey: ["externalContacts"],
        queryFn: getMyContacts,
        enabled: enabled, // Can be disabled if not needed immediately
    });

    const createContactMutation = useMutation({
        mutationFn: createContact,
        onSuccess: () => {
            queryClient.invalidateQueries(["externalContacts"]);
        },
    });

    const deleteContactMutation = useMutation({
        mutationFn: deleteContact,
        onSuccess: () => {
            queryClient.invalidateQueries(["externalContacts"]);
        },
    });

    return {
        contacts,
        isLoading,
        error,
        createContactMutation,
        deleteContactMutation,
    };
};
