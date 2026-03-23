import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./event.css";

export default function EventCard({ event }) {
    const {
        _id,
        eventName,
        eventType,
        location,
        virtualLink,
        startDate,
        startTime,
        endDate,
        endTime,
        eventDetails,
        coverImage,
        createdBy,
        guests,
    } = event;


    const { user } = useAuth();


    // Check if current user is invited
    const myGuestEntry = guests?.find(g => g.user?._id === user?._id || g.user === user?._id);
    const isInvited = !!myGuestEntry;
    const myGuestStatus = myGuestEntry?.status || "pending";

    // const [rsvpStatus, setRsvpStatus] = useState(null); // "going", "interested", "not_going"

    // Format date to display month and day
    const formatDate = (dateStr) => {
        if (!dateStr) return { month: "", day: "" };
        const date = new Date(dateStr);
        return {
            month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
            day: date.getDate(),
        };
    };

    // Format full date
    const formatFullDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Format time
    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        return timeStr;
    };

    const startDateObj = formatDate(startDate);

    return (
        <div className="event-card">
            <div className="card border-0 p-20 shadow-sm h-100 overflow-hidden">
                {/* Cover Image with Gradient Overlay */}
                <div className="event-cover rounded-3 position-relative">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={eventName}
                            className="w-100 rounded-3 h-100"
                        />
                    ) : (
                        <div className="cover-placeholder">
                            <Icon icon="mdi:calendar-star" width={80} />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="cover-gradient"></div>

                    {/* Date Badge */}
                    <div className="date-badge">
                        <div className="date-month">{startDateObj.month}</div>
                        <div className="date-day">{startDateObj.day}</div>
                    </div>

                    {/* Event Type Badge */}
                    <div className="position-absolute top-0 end-0 m-3">
                        <span className={`badge-pill ${eventType === "virtual" ? "badge-virtual" : "badge-inperson"}`}>
                            <Icon icon={eventType === "virtual" ? "mdi:video" : "mdi:map-marker"} width={16} />
                            <span className="ms-1">{eventType === "virtual" ? "Virtual" : "In-Person"}</span>
                        </span>
                    </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-4">
                    {/* Event Name */}
                    <h5 className="event-title fw-bold mb-3">{eventName}</h5>

                    {/* Date & Time */}
                    <div className="event-info-item">
                        <Icon icon="mdi:clock-outline" width={20} />
                        <div>
                            <div className="info-label">When</div>
                            <div className="info-text">
                                {formatFullDate(startDate)} · {formatTime(startTime)}
                            </div>
                        </div>
                    </div>

                    {/* Location / Virtual Link */}
                    <div className="event-info-item">
                        <Icon icon={eventType === "virtual" ? "mdi:video-outline" : "mdi:map-marker-outline"} width={20} />
                        <div>
                            <div className="info-label">Where</div>
                            <div className="info-text">
                                {eventType === "virtual" ? (
                                    <span className="text-primary">Virtual Event</span>
                                ) : (
                                    location || "TBA"
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    {eventDetails && (
                        <p className="event-description">{eventDetails}</p>
                    )}

                    {/* Guests & Host Info */}
                    <div className="event-meta">
                        {guests && guests.length > 0 && (
                            <div className="guests-count">
                                <Icon icon="mdi:account-multiple" width={18} />
                                <span>{guests.length} Guests</span>
                            </div>
                        )}

                        {createdBy && (
                            <div className="host-info">
                                <img
                                    src={createdBy?.profile?.profilePicture || "assets/images/avatar/user.png"}
                                    alt={`${createdBy.firstname}`}
                                    className="host-avatar"
                                />
                                <span className="host-name">
                                    {createdBy.firstname} {createdBy.lastname}
                                </span>
                            </div>
                        )}
                    </div>
                </div>




                {/* View Details Link */}
                <div className="p-3 pt-4">
                    <Link to={`/events/${_id}`} className="view-details-btn">
                        View Full Details
                        <Icon icon="mdi:arrow-right" width={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

