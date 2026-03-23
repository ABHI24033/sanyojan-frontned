import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { getPublicEventById } from "../../api/event";
import { useAuth } from "../../context/AuthContext";

export const useEventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const [copied, setCopied] = useState(false);
    const [showAddExternalGuest, setShowAddExternalGuest] = useState(false);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
    });
    const [isConfirmInvitation, setIsConfirmInvitation] = useState(false);

    // Fetch Event Data (Conditional based on Auth)
    const { data: event, isLoading, error } = useQuery({
        queryKey: ["event", id, isAuthenticated],
        queryFn: async () => {
            if (isAuthenticated) {
                const res = await axiosInstance.get(`/events/${id}`);
                return res.data.data;
            } else {
                return getPublicEventById(id);
            }
        },
        retry: false,
    });

    // [NEW] Fetch My Guest Status (Separate from Event object now)
    const { data: myGuestData, refetch: refetchMyStatus, isLoading: isLoadingGuest } = useQuery({
        queryKey: ["event-guest-status", id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/events/${id}/guests?user=me`);
            return res.data.data?.[0] || null; // API returns array
        },
        enabled: !!isAuthenticated && !!event,
        retry: false
    });

    // // Helper: Share Event Link
    // const handleShare = () => {
    //     const link = `${window.location.origin}/events/${id}`; // Universal Link
    //     navigator.clipboard.writeText(link).then(() => {
    //         setCopied(true);
    //         setTimeout(() => setCopied(false), 2000);
    //     });
    // };

    // Helper: Share Event Link (Universal)
    const handleShare = async () => {
        const link = `${window.location.origin}/events/${id}`;

        try {
            // Use native share on mobile & supported browsers
            if (navigator.share) {
                await navigator.share({
                    title: "You're Invited!",
                    text: "Join me at this event. Tap the link below 👇",
                    url: link,
                });
            } else {
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText(link);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (error) {
            console.error("Share failed:", error);
        }
    };


    // Helper: Refresh Data
    const handleStatusChange = () => {
        queryClient.invalidateQueries(["event", id]);
        if (isAuthenticated) refetchMyStatus();
    };

    // Helper: Handle RSVP Submit
    // Mutation: RSVP Submit
    const { mutate: handleRSVPSubmit, isPending: isRSVPLoading } = useMutation({
        mutationFn: async (data) => {
            if (isAuthenticated) {
                return await axiosInstance.put(`/events/${id}/rsvp`, data);
            } else {
                return await axiosInstance.put(`/events/public/${id}/rsvp`, data);
            }
        },
        onSuccess: (data, variables) => {
            const status = variables?.status || "accepted";
            if (isAuthenticated) {
                setAlert({
                    type: "success",
                    message: `You have responded: ${status}`,
                });
            } else {
                if (status === "accepted" || status === "maybe") {
                    setAlert({
                        type: "success",
                        message: "RSVP Submitted Successfully!",
                    });
                } else {
                    setAlert({
                        type: "info",
                        message: "Thank you for letting us know.",
                    });
                }
            }

            // Trigger UI Success View
            setIsConfirmInvitation(true);

            // Refresh data
            handleStatusChange();
        },
        onError: (err) => {
            console.error("RSVP Error:", err);
            setAlert({
                type: "danger",
                message: err.response?.data?.message || "Failed to submit RSVP",
            });
            setIsConfirmInvitation(false);
        }
    });

    // Computed Properties: User Specific Logic
    let isInvited = false;
    let myGuestEntry = myGuestData || null; // [FIX] Use fetched data
    let isHost = false;

    if (isAuthenticated && event) {
        // [NOTE]: "isInvited" logic is tricky now. 
        // If we invite people by adding them to EventGuest, myGuestData will exist.
        // If we still use the old "guests" array for the initial invite list, checking event.guests is still needed?
        // User asked for "separate model", assuming migration.
        // For now, if myGuestData exists, I am invited/interacted.
        // If I am the host, I am invited.

        if (myGuestData) {
            isInvited = true;
        } else {
            // Fallback: Check if I am in the legacy guests array (if not migrated yet)
            const inLegacyArray = event.guests?.some(g => {
                const guestUserId = g.user?._id || g.user?.id || g.user;
                const currentUserId = user?._id || user?.id;
                return guestUserId && currentUserId && String(guestUserId) === String(currentUserId);
            });
            isInvited = inLegacyArray;
        }

        const creatorId = event.createdBy?._id || event.createdBy;
        const currentUserId = user?._id || user?.id;

        if (creatorId && currentUserId && String(creatorId) === String(currentUserId)) {
            isHost = true;
            isInvited = true; // Host is always invited
        }
    }

    // Helper: Format Date
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
        });
    };

    return {
        // Data
        event,
        isLoading,
        isGuestLoading: isLoadingGuest, // [NEW] Expose guest loading state
        error,
        user,
        isAuthenticated,
        alert,
        setAlert,
        isConfirmInvitation,

        // Computed
        isInvited,
        myGuestEntry,
        isHost,

        // State
        copied,
        showAddExternalGuest,
        setShowAddExternalGuest,

        // Actions
        handleShare,
        handleRSVPSubmit,
        isRSVPLoading,
        formatDate,
        navigate, // Exposing navigate if needed by component
    };
};
