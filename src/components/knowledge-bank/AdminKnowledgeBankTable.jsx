import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Modal } from "react-bootstrap";
import MasterLayout from "../../masterLayout/MasterLayout";
import { useAdminKnowledgeBank, useKnowledgeBankMutations } from "../../hooks/knowledge-bank/useKnowledgeBank";
import CreateKnowledgeBankForm from "./CreateKnowledgeBankForm";

export default function AdminKnowledgeBankTable() {
    const { data: knowledgeBanks = [], isLoading, error } = useAdminKnowledgeBank();
    const { deleteKnowledgeBank, isDeleting } = useKnowledgeBankMutations();

    const [showModal, setShowModal] = useState(false);
    const [editingKnowledgeBankId, setEditingKnowledgeBankId] = useState(null);

    const handleOpenModal = (knowledgeBankId = null) => {
        setEditingKnowledgeBankId(knowledgeBankId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingKnowledgeBankId(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this entry?")) return;
        try {
            await deleteKnowledgeBank(id);
        } catch (err) {
            alert("Failed to delete");
        }
    };

    return (
        <MasterLayout>
            <div className="container-fluid py-4 min-vh-100 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold mb-1 fs-4">Knowledge Bank</h3>
                        <p className="text-secondary small mb-0">Manage all rituals and cultural documents from one place.</p>
                    </div>
                    <div className="d-flex gap-2">
                        {/* <Link to="/admin/settings" className="btn btn-outline-primary d-flex align-items-center px-4 rounded-pill">
                            <Icon icon="solar:settings-bold" className="me-2" width={20} />
                            Global Settings
                        </Link> */}
                        <button
                            onClick={() => handleOpenModal()}
                            className="btn btn-primary d-flex align-items-center px-20 rounded-pill"
                        >
                            <Icon icon="solar:add-circle-bold" className="me-2" width={20} />
                            Add Entry
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center">
                        <Icon icon="solar:danger-bold" className="me-2" />
                        Failed to load knowledge bank entries. Ensure you are a Super Admin.
                    </div>
                )}

                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-white border-bottom">
                                    <tr>
                                        <th className="ps-40 py-3 fw-bold text-uppercase small text-secondary">Title & Category</th>
                                        <th className="py-3 fw-bold text-uppercase small text-secondary">Religion</th>
                                        <th className="py-3 fw-bold text-uppercase small text-secondary">Content Type</th>
                                        <th className="py-3 text-end pe-4 fw-bold text-uppercase small text-secondary">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <div className="spinner-border text-primary" role="status"></div>
                                                <p className="mt-2 text-secondary small">Loading entries...</p>
                                            </td>
                                        </tr>
                                    ) : knowledgeBanks.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-muted">
                                                <Icon icon="solar:library-linear" width={48} className="mb-2 opacity-50" />
                                                <p className="mb-0">No entries found.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        knowledgeBanks.map((knowledgeBank) => (
                                            <tr key={knowledgeBank._id}>
                                                <td className="ps-40">
                                                    <div className="fw-bold text-dark">{knowledgeBank.title}</div>
                                                    <div className="text-secondary small">{knowledgeBank.category}</div>
                                                </td>
                                                <td>
                                                    <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3">
                                                        {knowledgeBank.religion}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-3">
                                                        {knowledgeBank.pdfUrl && (
                                                            <div className="d-flex align-items-center text-danger small">
                                                                <Icon icon="logos:google-drive" width={18} className="me-1" />
                                                                PDF
                                                            </div>
                                                        )}
                                                        {knowledgeBank.videoUrl && (
                                                            <div className="d-flex align-items-center text-primary small">
                                                                <Icon icon="logos:youtube-icon" width={18} className="me-1" />
                                                                Video
                                                            </div>
                                                        )}
                                                        {!knowledgeBank.pdfUrl && !knowledgeBank.videoUrl && <span className="text-muted small">-</span>}
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(knowledgeBank._id)}
                                                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                                            title="Edit Entry"
                                                        >
                                                            <Icon icon="solar:pen-new-square-linear" width={18} className="me-1" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                                            onClick={() => handleDelete(knowledgeBank._id)}
                                                            title="Delete Entry"
                                                            disabled={isDeleting}
                                                        >
                                                            <Icon icon="solar:trash-bin-trash-linear" width={18} className="me-1" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">
                        {editingKnowledgeBankId ? "Edit Entry" : "Add New Entry"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <CreateKnowledgeBankForm
                        knowledgeBankId={editingKnowledgeBankId}
                        onSuccess={handleCloseModal}
                    />
                </Modal.Body>
            </Modal>
        </MasterLayout>
    );
}

