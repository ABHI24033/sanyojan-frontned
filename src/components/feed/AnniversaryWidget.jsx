import React from "react";
import { Link } from "react-router-dom";
import { useCelebrations } from "../../hooks/useCelebrations";

export default function AnniversaryWidget() {
    const { anniversaries, isLoading } = useCelebrations();

    const getDaysUntilText = (daysUntil) => {
        if (daysUntil === 0) return "Today";
        if (daysUntil === 1) return "Tomorrow";
        return `In ${daysUntil} days`;
    };

    if (isLoading || anniversaries.length === 0) return null;

    return (
        <div className="card shadow-sm border-0 rounded-4 p-20 mt-20 bg-white">
            <h5 className="fw-bold fs-5 mb-3">💍 Marriage Anniversary in next 3 days</h5>
            <div className="mb-0">
                {anniversaries.map((anniversary) => (
                    <Link
                        key={anniversary.userId}
                        to={`/profile/${anniversary.userId}`}
                        className="text-decoration-none w-100"
                    >
                        <div className="d-flex align-items-center justify-content-between p-10 w-100 mb-3 rounded-3 bg-light hover-shadow transition-2">
                            <div className="d-flex align-items-center">
                                <img
                                    src={anniversary.profilePicture || "assets/images/avatar/user.png"}
                                    alt={anniversary.name}
                                    className="rounded-circle me-3 border border-2 border-white shadow-sm"
                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                                <div>
                                    <h6 className="fw-semibold text-sm text-dark mb-0">{anniversary.name}</h6>
                                    <small className="text-muted text-xs">
                                        {getDaysUntilText(anniversary.daysUntil)}
                                    </small>
                                </div>
                            </div>
                            {/* <span className="badge bg-success-subtle text-success fw-medium px-2 py-1 rounded-pill text-xs">
                                Anniv.
                            </span> */}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
