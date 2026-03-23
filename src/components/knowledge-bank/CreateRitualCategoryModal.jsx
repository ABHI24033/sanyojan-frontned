import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useCategoryMutations } from "../../hooks/knowledge-bank/useRitualCategories";

export default function CreateRitualCategoryModal({ show, onHide, religion, onSuccess }) {
    const { createCategory, isCreating } = useCategoryMutations();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return setError("Category name is required");
        if (!religion) return setError("Please select a religion first in the main form");

        try {
            await createCategory({ religion, name, description });
            setName("");
            setDescription("");
            setError("");
            onSuccess();
            onHide();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to create category");
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content p-10 border border-secondary shadow-lg">
                    <div className="modal-header border-bottom border-secondary py-2">
                        <h6 className="modal-title fw-bold small">
                            Create New Category
                        </h6>
                        <button
                            type="button"
                            className="btn-close btn-close-white small"
                            onClick={onHide}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body pt-3">
                        {error && (
                            <div className="alert alert-danger py-1 px-2 d-flex align-items-center small mb-3">
                                <Icon icon="solar:danger-circle-bold" className="me-2" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {religion && (
                                <div className="mb-3">
                                    <span className="badge bg-secondary text-white border border-secondary fw-normal px-2 py-1 rounded-1 small">
                                        Religion: {religion}
                                    </span>
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary mb-1">Category Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm bg-light text-dark border-secondary"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Marriage, Sanskar"
                                    autoFocus
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary mb-1">Description</label>
                                <textarea
                                    className="form-control form-control-sm bg-light text-dark border-secondary"
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Optional description..."
                                />
                            </div>

                            <div className="d-flex justify-content-end gap-2  pt-3">
                                <button type="button" className="btn btn-outline-secondary btn-sm px-20 rounded-pill" onClick={onHide}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm px-20 rounded-pill fw-bold"
                                    disabled={isCreating}
                                >
                                    {isCreating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Category"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
