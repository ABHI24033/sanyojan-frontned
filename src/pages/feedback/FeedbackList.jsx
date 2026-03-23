import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { getAllFeedback } from "../../api/feedback";
import { useNavigate } from "react-router-dom";

export default function FeedbackList() {
    const navigate = useNavigate();
    const [categoryFilter, setCategoryFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ["feedback", categoryFilter, currentPage],
        queryFn: () => getAllFeedback({ category: categoryFilter, page: currentPage, limit: 10 }),
        refetchOnWindowFocus: false
    });

    const feedback = data?.data || [];
    const pagination = data?.pagination || {};

    const getCategoryBadge = (category) => {
        const badges = {
            bug: { color: "danger", icon: "mdi:bug", label: "Bug Report" },
            feature_request: { color: "primary", icon: "mdi:lightbulb", label: "Feature Request" },
            general: { color: "secondary", icon: "mdi:message", label: "General" },
            improvement: { color: "info", icon: "mdi:trending-up", label: "Improvement" }
        };
        return badges[category] || badges.general;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">
                            <Icon icon="mdi:clipboard-text" className="me-2" />
                            Feedback
                        </h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/feedback")}
                        >
                            <Icon icon="mdi:plus" className="me-2" />
                            Submit Feedback
                        </button>
                    </div>

                    {/* Filter */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Filter by Category</label>
                                    <select
                                        className="form-select"
                                        value={categoryFilter}
                                        onChange={(e) => {
                                            setCategoryFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="general">General Feedback</option>
                                        <option value="bug">Bug Reports</option>
                                        <option value="feature_request">Feature Requests</option>
                                        <option value="improvement">Improvements</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="alert alert-danger">
                            <Icon icon="mdi:alert" className="me-2" />
                            Failed to load feedback
                        </div>
                    )}

                    {/* Feedback List */}
                    {!isLoading && !error && (
                        <>
                            {feedback.length === 0 ? (
                                <div className="alert alert-info">
                                    <Icon icon="mdi:information" className="me-2" />
                                    No feedback found
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {feedback.map((item) => {
                                        const badge = getCategoryBadge(item.category);
                                        return (
                                            <div key={item._id} className="col-12">
                                                <div className="card border-0 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div className="flex-grow-1">
                                                                <h5 className="card-title fw-bold mb-2">
                                                                    {item.title}
                                                                </h5>
                                                                <div className="d-flex gap-2 flex-wrap mb-2">
                                                                    <span className={`badge bg-${badge.color}`}>
                                                                        <Icon icon={badge.icon} className="me-1" />
                                                                        {badge.label}
                                                                    </span>
                                                                    {item.rating > 0 && (
                                                                        <span className="badge bg-warning text-dark">
                                                                            <Icon icon="mdi:star" className="me-1" />
                                                                            {item.rating}/5
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <p className="card-text text-muted mb-3">
                                                            {item.message}
                                                        </p>

                                                        <div className="d-flex justify-content-between align-items-center text-muted small">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Icon icon="mdi:account" />
                                                                <span>
                                                                    {item.user?.firstname} {item.user?.lastname}
                                                                </span>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Icon icon="mdi:clock-outline" />
                                                                <span>{formatDate(item.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="d-flex justify-content-center gap-2 mt-4">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <Icon icon="mdi:chevron-left" />
                                    </button>
                                    <span className="btn btn-outline-secondary disabled">
                                        Page {currentPage} of {pagination.pages}
                                    </span>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                                        disabled={currentPage === pagination.pages}
                                    >
                                        <Icon icon="mdi:chevron-right" />
                                    </button>
                                </div>
                            )}

                            {/* Total Count */}
                            {pagination.total > 0 && (
                                <div className="text-center mt-3 text-muted small">
                                    Showing {feedback.length} of {pagination.total} feedback items
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
