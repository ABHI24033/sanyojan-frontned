import React from "react";
import "./common.css"; // ADD custom styling here

export default function ConfirmModal({
    show,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    onConfirm,
    onCancel,
    isPending = false,
}) {
    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="custom-backdrop"></div>

            {/* Modal */}
            <div className="modal fade show custom-modal" style={{ display: "block" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-4 p-10" style={{ height: "200px" }}>

                        {/* Header */}
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fs-5 fw-bold text-danger">{title}</h5>
                            <button type="button" className="btn-close" onClick={onCancel}></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body text-secondary fs-6 pt-2">
                            {message}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-0 d-flex gap-2">
                            <button className="btn btn-light py-4 px-10 rounded-3" onClick={onCancel}>
                                Cancel
                            </button>
                            <button className="btn btn-primary py-4 px-10 rounded-3" onClick={onConfirm}>
                                {isPending ? "loading..." : "Yes, Continue"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
