import React from "react";
import { Link } from "react-router-dom";
import { useCelebrations } from "../../hooks/useCelebrations";

export default function DeathAnniversaryWidget() {
    const { deathAnniversaries, isLoading } = useCelebrations();

    const getDaysUntilText = (daysUntil) => {
        if (daysUntil === 0) return "Today";
        if (daysUntil === 1) return "Tomorrow";
        return `In ${daysUntil} days`;
    };

    if (isLoading || deathAnniversaries.length === 0) return null;

    return (
        <div className="card shadow-sm border-0 rounded-4 p-20 mt-20 bg-white">
            <h5 className="fw-bold fs-5 mb-3 text-neutral-800">Death Anniversary</h5>
            <div className="mb-0">
                {deathAnniversaries.map((item) => (
                    <Link
                        key={item.userId}
                        to={`/profile/${item.userId}`}
                        className="text-decoration-none w-100"
                    >
                        <div className="d-flex align-items-center justify-content-between p-10 w-100 mb-3 rounded-3 bg-neutral-50 hover-bg-neutral-100 transition-2 border border-neutral-100">
                            <div className="d-flex align-items-center">
                                <div className="position-relative">
                                    <img
                                        src={item.profilePicture || "assets/images/avatar/user.png"}
                                        alt={item.name}
                                        className="rounded-circle me-3 border border-2 border-neutral-200 grayscale"
                                        style={{ width: "40px", height: "40px", objectFit: "cover", filter: "grayscale(100%)" }}
                                    />
                                </div>
                                <div>
                                    <h6 className="fw-semibold text-sm text-neutral-700 mb-0">{item.name}</h6>
                                    <small className="text-neutral-500 text-xs">
                                        {getDaysUntilText(item.daysUntil)}
                                    </small>
                                </div>
                            </div>
                            {/* <span className="badge bg-secondary-subtle text-secondary fw-medium px-2 py-1 rounded-pill text-xs">
                                Remembrance
                            </span> */}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
