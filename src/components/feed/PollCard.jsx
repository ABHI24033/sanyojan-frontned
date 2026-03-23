import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { timeAgo } from "../../helper/utils";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./feed.css";

export default function PollCard({ poll, handleVote, isVoting }) {
    const { user } = useAuth();
    const [selectedOption, setSelectedOption] = useState(null);

    const isExpired = new Date() > new Date(poll.expiresAt);
    const hasVoted = poll.hasVoted;
    const totalVotes = poll.totalVotes || 0;
    const isOwner = user?.id === poll?.author?._id;

    const handleOptionClick = (optionIndex) => {
        if (isExpired || hasVoted || isVoting) return;

        setSelectedOption(optionIndex);
        handleVote(poll._id, optionIndex);
    };

    const getPercentage = (votes) => {
        if (totalVotes === 0) return 0;
        return ((votes / totalVotes) * 100).toFixed(1);
    };

    const getTimeRemaining = () => {
        const now = new Date();
        const expiry = new Date(poll.expiresAt);
        const diff = expiry - now;

        if (diff <= 0) return "Poll ended";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
        return "Less than 1 hour left";
    };

    return (
        <div className="card mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-0">
                {/* Poll Header */}
                <div className="d-flex align-items-center p-3 border-bottom border-light">
                    <div className="me-3">
                        <Link to={`/profile?userId=${poll?.author?._id}`}>
                            <img
                                src={poll?.author?.profilePicture}
                                alt="profile"
                                className="rounded-circle object-fit-cover"
                                width="48"
                                height="48"
                            />
                        </Link>
                    </div>

                    <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold fs-6 text-capitalize">
                            <Link
                                to={`/profile?userId=${poll?.author?._id}`}
                                className="text-dark text-decoration-none"
                            >
                                {poll?.author?.firstname} {poll?.author?.lastname}
                            </Link>
                        </h6>
                        <div className="d-flex align-items-center gap-2">
                            <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                                {timeAgo(poll?.createdAt)}
                            </small>
                            <span className="text-muted">•</span>
                            <small className="text-muted d-flex align-items-center" style={{ fontSize: "0.85rem" }}>
                                <Icon icon="mdi:poll" className="me-1" />
                                Poll
                            </small>
                        </div>
                    </div>
                </div>

                {/* Poll Question */}
                <div className="p-3">
                    <h5 className="fw-bold text-dark fs-6 mb-3">{poll.question}</h5>

                    {/* Poll Options */}
                    <div className="d-flex flex-column gap-2">
                        {poll.options.map((option, index) => {
                            const votes = option.votes?.length || 0;
                            const percentage = getPercentage(votes);
                            const isSelected = selectedOption === index;

                            return (
                                <button
                                    key={index}
                                    className={`btn text-start position-relative overflow-hidden border ${hasVoted || isExpired
                                        ? "btn-outline-secondary"
                                        : "btn-outline-primary"
                                        } ${isSelected ? "border-primary border-2" : ""}`}
                                    style={{
                                        minHeight: "50px",
                                        cursor: isExpired || hasVoted ? "default" : "pointer",
                                        opacity: isExpired ? 0.6 : 1,
                                    }}
                                    onClick={() => handleOptionClick(index)}
                                    disabled={isExpired || hasVoted || isVoting}
                                >
                                    {/* Progress Bar Background */}
                                    {(hasVoted || isExpired) && (
                                        <div
                                            className="position-absolute top-0 start-0 h-100 bg-primary bg-opacity-10"
                                            style={{
                                                width: `${percentage}%`,
                                                transition: "width 0.3s ease",
                                                zIndex: 0,
                                            }}
                                        />
                                    )}

                                    {/* Option Content */}
                                    <div className="position-relative d-flex justify-content-between align-items-center w-100" style={{ zIndex: 1 }}>
                                        <span className="fw-medium">{option.text}</span>
                                        {(hasVoted || isExpired) && (
                                            <div className="d-flex align-items-center gap-2">
                                                {/* <span className="badge bg-primary">{votes} vote{votes !== 1 ? 's' : ''}</span> */}
                                                <span className="fw-bold text-primary">{percentage}%</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Poll Stats */}
                    <div className="mt-3 d-flex justify-content-between align-items-center text-muted">
                        <small className="fw-medium d-flex align-items-center">
                            <Icon icon="mdi:account-group" className="me-1" />
                            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                        </small>
                        <small className={isExpired ? "text-danger d-flex align-items-center" : "fw-medium d-flex align-items-center"}>
                            <Icon icon="mdi:clock-outline" className="me-1" />
                            {getTimeRemaining()}
                        </small>
                    </div>

                    {/* Poll Status Messages */}
                    {hasVoted && !isExpired && (
                        <div className="alert alert-success mt-3 mb-0 py-2 d-flex align-items-center" role="alert">
                            <Icon icon="mdi:check-circle" className="me-2" />
                            You voted on this poll
                        </div>
                    )}

                    {isExpired && (
                        <div className="alert alert-secondary fw-medium d-flex align-items-center mt-3 mb-0 py-2 d-flex justify-content-between" role="alert">
                            <Icon icon="mdi:information" className="me-2" />
                            This poll has ended
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
