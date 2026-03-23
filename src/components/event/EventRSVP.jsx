import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { respondToEvent } from "../../api/event";
import { toast } from "react-toastify";

export default function EventRSVP({ eventId, initialStatus, onStatusChange }) {
    const [status, setStatus] = useState(initialStatus || "pending");
    const [isLoading, setIsLoading] = useState(false);

    const handleRSVP = async (newStatus) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            await respondToEvent(eventId, newStatus);
            setStatus(newStatus);
            if (onStatusChange) onStatusChange(newStatus);
            toast.success(`You have ${newStatus === "maybe" ? "tentatively accepted" : newStatus} the event`);
        } catch (error) {
            toast.error(error.message || "Failed to update RSVP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rsvp-buttons d-flex justify-content-between gap-2">
            <button
                className={`btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 ${status === "accepted" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => handleRSVP("accepted")}
                disabled={isLoading}
            >
                <Icon icon={status === "accepted" ? "mdi:check-circle" : "mdi:check-circle-outline"} width={20} />
                <span>Going</span>
            </button>
            <button
                className={`btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 ${status === "maybe" ? "btn-warning text-white" : "btn-outline-warning"}`}
                onClick={() => handleRSVP("maybe")}
                disabled={isLoading}
            >
                <Icon icon={status === "maybe" ? "mdi:help-circle" : "mdi:help-circle-outline"} width={20} />
                <span>Maybe</span>
            </button>
            <button
                className={`btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 ${status === "rejected" ? "btn-danger" : "btn-outline-danger"}`}
                onClick={() => handleRSVP("rejected")}
                disabled={isLoading}
            >
                <Icon icon={status === "rejected" ? "mdi:close-circle" : "mdi:close-circle-outline"} width={20} />
                <span>No</span>
            </button>
        </div>
    );
}
