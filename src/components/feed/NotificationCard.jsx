import React, { useEffect } from "react";
import "./feed.css"
import BirthdayWidget from "./BirthdayWidget";
import AnniversaryWidget from "./AnniversaryWidget";
import DeathAnniversaryWidget from "./DeathAnniversaryWidget";
import FamilyZone from "./FamilyZone";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../../api/notification";
import { format } from "date-fns";

export default function NotificationCard() {

    // Fetch recent 5 notifications
    const { data } = useQuery({
        queryKey: ["recentNotifications"],
        queryFn: () => getNotifications({ limit: 5 }),
    });

    const notifications = data?.data || [];

    return (
        <div className="w-100 order-3">
            <aside className="widget-area">

                {/* Recent Notifications */}
                <div className="card shadow-sm border-0 rounded-4">
                    <div className="card-header bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold fs-5 mb-0">Recent Notifications</h5>
                        <Link to="/notifications" className="text-decoration-none small fw-bold">View All</Link>
                    </div>
                    <div className="card-body">
                        {notifications.length === 0 ? (
                            <p className="text-muted small text-center my-3">No new notifications</p>
                        ) : (
                            <ul className="list-unstyled m-1">
                                {notifications.map((n, index) => (
                                    <li
                                        key={index}
                                        className="d-flex align-items-center py-4 mb-3 hover-bg"
                                        style={{
                                            transition: "0.2s",
                                        }}
                                    >
                                        <Link
                                            to={
                                                n.type === 'post' ? `/post/${n.referenceId}` :
                                                    n.type === 'poll' ? `/poll/${n.referenceId}` :
                                                        n.type === 'event' ? `/events/${n.referenceId}` :
                                                            n.type === 'notice' ? `/notice/${n.referenceId}` :
                                                                '#'
                                            }
                                            className="d-flex align-items-center text-decoration-none text-dark w-100"
                                        >
                                            {n.sender?.profile?.profilePicture ? (
                                                <img
                                                    src={n.sender.profile?.profilePicture}
                                                    alt="profile"
                                                    className="rounded-circle me-3"
                                                    width="40"
                                                    height="40"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div
                                                    className="rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary fw-bold me-3"
                                                    style={{ width: "40px", height: "40px", minWidth: "40px" }}
                                                >
                                                    {n.sender?.firstname?.[0] || "N"}
                                                </div>
                                            )}

                                            <div>
                                                <h6 className="mb-0 text-md fw-normal" title={n.message}>
                                                    {n.message.length > 50 ? n.message.slice(0, 50) + "..." : n.message}
                                                </h6>
                                                <small className="text-muted">
                                                    {n.createdAt ? format(new Date(n.createdAt), "MMM d, h:mm a") : ""}
                                                </small>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Dynamic Birthdays, Anniversaries & Remembrance */}
                <BirthdayWidget />
                <AnniversaryWidget />
                <DeathAnniversaryWidget />

                {/* Family Zone */}
                <FamilyZone />
            </aside>
        </div>
    );
}
