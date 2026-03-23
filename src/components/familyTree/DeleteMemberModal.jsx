import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Icon } from "@iconify/react";

const DeleteMemberModal = ({ show, onClose, onDelete, memberName }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        await onDelete();
        setLoading(false);
    };

    return (
        <Modal show={show} onHide={onClose} centered size="sm">
            <Modal.Body className="p-24 text-center">
                <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-16"
                    style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: '#fee2e2'
                    }}
                >
                    <Icon icon="solar:trash-bin-trash-bold" style={{ fontSize: '32px', color: '#ef4444' }} />
                </div>

                <h5 className="fw-bold text-neutral-900 mb-8">Delete Member?</h5>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800 text-lg font-bold mb-2">
                        ⚠️ Critical Warning
                    </p>
                    <p className="text-red-700 font-medium text-base">
                        Are you sure you want to delete <span className="font-extrabold underline">{memberName}</span>?
                    </p>
                    <p className="text-red-600 font-black text-lg text-lg mt-2">
                        This action will <strong>permanently remove</strong> this member and may impact all connected nodes in the family tree hierarchy.
                    </p>
                    <p className="text-red-800 font-black text-lg mt-3 uppercase tracking-wide">
                        THIS ACTION CANNOT BE UNDONE.
                    </p>
                </div>

                <div className="d-flex gap-12 justify-content-center">
                    <button
                        type="button"
                        className="btn btn-light text-sm px-20 py-10 radius-8 flex-grow-1"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger text-sm px-20 py-10 radius-8 flex-grow-1 d-flex align-items-center justify-content-center"
                        onClick={handleDelete}
                        disabled={loading}
                        style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Deleting...
                            </>
                        ) : (
                            "Yes, Delete"
                        )}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteMemberModal;
