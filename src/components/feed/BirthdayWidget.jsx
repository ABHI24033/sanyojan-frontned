import React from "react";
import { Link } from "react-router-dom";
import { useCelebrations } from "../../hooks/useCelebrations";

export default function BirthdayWidget() {
    const { birthdays, isLoading } = useCelebrations();

    const getDaysUntilText = (daysUntil) => {
        if (daysUntil === 0) return "Today";
        if (daysUntil === 1) return "Tomorrow";
        return `In ${daysUntil} days`;
    };
    if (isLoading || birthdays.length === 0) return null;

    return (
        <div className="card shadow-sm border-0 rounded-4 p-20 mt-20 bg-white">
            <h5 className="fw-bold fs-5 mb-3">🎂 Birthdays in next 3 days</h5>
            <div className="mb-0">
                {birthdays.map((birthday) => (
                    <Link
                        key={birthday.userId}
                        to={`/profile/${birthday.userId}`}
                        className="text-decoration-none w-100"
                    >
                        <div className="d-flex align-items-center justify-content-between p-10 w-100 mb-3 rounded-3 bg-light hover-shadow transition-2">
                            <div className="d-flex align-items-center">
                                <img
                                    src={birthday.profilePicture || "assets/images/avatar/user.png"}
                                    alt={birthday.name}
                                    className="rounded-circle me-3 border border-2 border-white shadow-sm"
                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                                <div>
                                    <h6 className="fw-semibold text-sm text-dark mb-0">{birthday.name}</h6>
                                    <small className="text-muted text-xs">
                                        {getDaysUntilText(birthday.daysUntil)}
                                    </small>
                                </div>
                            </div>
                            {/* <span className="badge bg-primary-subtle text-primary fw-medium px-10 py-2 rounded-pill text-xs">
                                {birthday.age ? `${birthday.age}th` : 'B-Day'}
                            </span> */}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
