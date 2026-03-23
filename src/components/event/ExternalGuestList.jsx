import React from "react";
import { Icon } from "@iconify/react";

const ExternalGuestList = ({ externalGuests }) => {
    if (!externalGuests || externalGuests.length === 0) return null;

    const getInitials = (name) => {
        const names = name.split(" ");
        return names.map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    // Grouping by Relation (Optional, but user asked for "friend and relative section")
    // For now, listing them all in cards as requested.

    return (
        <div className="row g-3">
            {externalGuests.map((guest, index) => (
                <div key={index} className="col-md-6 col-lg-12 col-xl-6">
                    <div className="card h-100 border rounded-4 shadow-sm p-3">
                        <div className="d-flex align-items-center">
                            {/* Avatar with Initials */}
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 flex-shrink-0"
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    backgroundColor: guest.relation === "Friend" ? "#0d6efd" : "#198754", // Blue for Friend, Green for Relative
                                    fontSize: "1.2rem"
                                }}
                            >
                                {getInitials(guest.name)}
                            </div>

                            <div className="flex-grow-1 overflow-hidden">
                                <h6 className="mb-0 fw-bold text-truncate" title={guest.name}>{guest.name}</h6>
                                <small className="text-muted d-block text-truncate">
                                    <Icon icon="mdi:account-outline" className="me-1 align-text-bottom" />
                                    {guest.relation}
                                </small>
                                <small className="text-muted d-block text-truncate">
                                    <Icon icon="mdi:phone" className="me-1 align-text-bottom" />
                                    {guest.mobile}
                                </small>
                                {guest.email && (
                                    <small className="text-muted d-block text-truncate">
                                        <Icon icon="mdi:email-outline" className="me-1 align-text-bottom" />
                                        {guest.email}
                                    </small>
                                )}
                            </div>

                            <div className="ms-2">
                                <span className={`badge rounded-pill ${guest.status === 'accepted' ? 'bg-success-subtle text-success' :
                                        guest.status === 'rejected' ? 'bg-danger-subtle text-danger' :
                                            'bg-warning-subtle text-warning-emphasis'
                                    }`}>
                                    {guest.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExternalGuestList;
