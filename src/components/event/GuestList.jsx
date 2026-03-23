import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

const GuestList = ({ guests = [] }) => {
    const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

    const groupedGuests = useMemo(() => {
        const groups = {
            accepted: [],
            maybe: [],
            rejected: [],
            pending: []
        };

        guests.forEach(guest => {
            const status = guest.status || "pending";
            if (groups[status]) {
                groups[status].push(guest);
            } else {
                groups.pending.push(guest);
            }
        });

        return groups;
    }, [guests]);

    const statusConfig = {
        accepted: { label: "Going", icon: "mdi:check-circle", color: "text-success", bg: "bg-success-subtle" },
        maybe: { label: "Maybe", icon: "mdi:help-circle", color: "text-warning", bg: "bg-warning-subtle" },
        rejected: { label: "Can't Go", icon: "mdi:close-circle", color: "text-danger", bg: "bg-danger-subtle" },
        pending: { label: "Invited", icon: "mdi:email-outline", color: "text-secondary", bg: "bg-light" }
    };

    const getAvatar = (user) => {
        if (user?.avatar) return user.avatar;
        const gender = user?.profile?.gender?.toLowerCase();
        if (gender === 'female') return "https://avatar.iran.liara.run/public/girl";
        return "https://avatar.iran.liara.run/public/boy"; // Default to boy or generic
    };

    const renderGroup = (status, list) => {
        if (list.length === 0) return null;
        const config = statusConfig[status];

        return (
            <div key={status} className="mb-4">
                <div className="d-flex align-items-center mb-3 position-sticky top-0 bg-white py-2 z-1 border-bottom">
                    <span className={`badge ${config.bg} ${config.color} me-2 rounded-pill d-flex align-items-center gap-1 px-3 py-2`}>
                        <Icon icon={config.icon} width={16} />
                        {config.label}
                    </span>
                    <span className="text-muted small">({list.length})</span>
                </div>

                <div className="d-flex flex-column gap-3">
                    {list.map((guest, idx) => (
                        <div key={idx} className="d-flex align-items-center bg-white p-3 rounded border shadow-sm">
                            <img
                                src={getAvatar(guest.user)}
                                alt={guest.user?.firstname}
                                className="rounded-circle me-3 object-fit-cover border"
                                width={48}
                                height={48}
                            />
                            <div className="flex-grow-1">
                                <h6 className="mb-0 text-lg fw-bold">
                                    {guest.user?.firstname} {guest.user?.lastname}
                                </h6>
                                {guest.user?.email && (
                                    <small className="text-muted">
                                        {guest.user.email}
                                    </small>
                                )}
                            </div>
                            <div className="ms-auto">
                                <span className={`badge ${config.bg} ${config.color} rounded-pill`}>
                                    {config.icon && <Icon icon={config.icon} className="me-1" />}
                                    {config.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (!guests || guests.length === 0) {
        return <div className="text-muted text-center py-3">No guests invited yet.</div>;
    }

    return (
        <div className="guest-list">
            {renderGroup("accepted", groupedGuests.accepted)}
            {renderGroup("maybe", groupedGuests.maybe)}
            {renderGroup("pending", groupedGuests.pending)}
            {renderGroup("rejected", groupedGuests.rejected)}
        </div>
    );
};

export default GuestList;
