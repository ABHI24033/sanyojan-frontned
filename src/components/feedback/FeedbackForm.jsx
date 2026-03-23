import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFeedback } from "../../api/feedback";
import { useNavigate } from "react-router-dom";

export default function FeedbackForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        category: "general",
        rating: 0
    });
    const [alert, setAlert] = useState({ type: "", message: "" });

    const createMutation = useMutation({
        mutationFn: createFeedback,
        onSuccess: () => {
            queryClient.invalidateQueries(["feedback"]);
            setAlert({ type: "success", message: "Feedback submitted successfully!" });
            setFormData({
                title: "",
                message: "",
                category: "general",
                rating: 0
            });
            setTimeout(() => {
                navigate("/feedback/view");
            }, 1500);
        },
        onError: (err) => {
            setAlert({ type: "danger", message: err.message || "Failed to submit feedback" });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.message.trim()) {
            setAlert({ type: "danger", message: "Title and message are required" });
            return;
        }

        createMutation.mutate(formData);
    };

    const handleRating = (value) => {
        setFormData({ ...formData, rating: value });
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card border-0 p-5 shadow-sm">
                        <div className="card-body p-4">
                            <h3 className="card-title mb-4 d-flex align-items-center gap-2">
                                <Icon icon="mdi:message-text" className="fs-3 text-primary" />
                                <span>Submit Feedback</span>
                            </h3>

                            {alert.message && (
                                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                                    {alert.message}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setAlert({ type: "", message: "" })}
                                    />
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Category
                                    </label>
                                    <select
                                        className="form-select"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="general">General Feedback</option>
                                        <option value="bug">Bug Report</option>
                                        <option value="feature_request">Feature Request</option>
                                        <option value="improvement">Improvement Suggestion</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label fw-semibold">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        placeholder="Brief title for your feedback"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label fw-semibold">
                                        Message
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        rows="6"
                                        placeholder="Describe your feedback in detail..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        style={{ resize: "none" }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold d-block">
                                        Rating (Optional)
                                    </label>
                                    <div className="d-flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className="btn btn-link p-0"
                                                onClick={() => handleRating(star)}
                                            >
                                                <Icon
                                                    icon={formData.rating >= star ? "mdi:star" : "mdi:star-outline"}
                                                    className={`fs-2 ${formData.rating >= star ? "text-warning" : "text-muted"}`}
                                                />
                                            </button>
                                        ))}
                                        {formData.rating > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-link btn-sm text-danger"
                                                onClick={() => handleRating(0)}
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-grow-1"
                                        disabled={createMutation.isPending}
                                    >
                                        {createMutation.isPending ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Icon icon="mdi:send" className="me-2" />
                                                Submit Feedback
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate("/feedback/view")}
                                    >
                                        View All Feedback
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
