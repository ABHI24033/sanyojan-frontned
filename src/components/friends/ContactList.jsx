import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useFriends } from "../../hooks/friends/useFriends";
import AlertBox from "../ui/Alert";
import ConfirmModal from "../common/ConfirmModal";

const ContactList = () => {
    const { contacts, isLoading, deleteContactMutation } = useFriends(true);
    const [alert, setAlert] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);

    const getInitials = (name) => {
        const names = name.split(" ");
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const handleDeleteClick = (id, name) => {
        setContactToDelete({ id, name });
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!contactToDelete) return;
        try {
            await deleteContactMutation.mutateAsync(contactToDelete.id);
            setAlert({ type: "success", message: "Contact deleted successfully" });
            setShowConfirm(false);
            setContactToDelete(null);
        } catch (error) {
            setAlert({ type: "danger", message: "Failed to delete contact" });
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary border-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted fw-medium">Loading your connections...</p>
            </div>
        );
    }

    if (!contacts || contacts.length === 0) {
        return (
            <div className="text-center py-5 bg-white h-100 d-flex flex-column align-items-center justify-content-center">
                <div className="bg-light p-4 rounded-circle d-inline-block mb-3">
                    <Icon icon="solar:users-group-two-rounded-linear" width={48} className="text-muted opacity-50" />
                </div>
                <h5 className="fw-bold text-dark">No connections yet</h5>
                <p className="text-secondary small max-w-250 mx-auto">
                    Start by adding your friends and relatives to easily invite them to your upcoming events.
                </p>
            </div>
        );
    }

    return (
        <div className="contact-list-wrapper">
            {alert && <div className="mb-4"><AlertBox type={alert.type} message={alert.message} onClose={() => setAlert(null)} /></div>}

            <div className="row g-3 overflow-y-auto pe-2" style={{ maxHeight: "600px" }}>
                {contacts.map((contact) => (
                    <div key={contact._id} className="col-12 col-md-6 col-xl-6 animation-slide-up">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-3 contact-card transition-all">
                            <div className="d-flex align-items-center">
                                {/* Avatar with Initials */}
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 flex-shrink-0 shadow-sm border-white border-2"
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                        background: contact.relation === "Friend"
                                            ? "linear-gradient(45deg, #0d6efd, #0dcaf0)"
                                            : "linear-gradient(45deg, #198754, #20c997)",
                                        fontSize: "1.25rem",
                                        border: "2px solid #fff"
                                    }}
                                >
                                    {getInitials(contact.name)}
                                </div>

                                <div className="flex-grow-1 overflow-hidden">
                                    <h6 className="mb-1 fw-bold text-dark text-truncate" title={contact.name}>
                                        {contact.name}
                                    </h6>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className={`badge rounded-pill fw-medium ${contact.relation === "Friend" ? "bg-primary-subtle text-primary" : "bg-success-subtle text-success"
                                            }`} style={{ fontSize: "10px", padding: "4px 10px" }}>
                                            {contact.relation}
                                        </span>
                                        {contact.foodPreference && (
                                            <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis fw-medium" style={{ fontSize: "10px", padding: "4px 10px" }}>
                                                {contact.foodPreference}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="ms-auto">
                                    <button
                                        className="btn btn-icon btn-sm text-danger d-flex align-items-center justify-content-center hover-bg-danger-subtle rounded-circle p-0"
                                        onClick={() => handleDeleteClick(contact._id, contact.name)}
                                        disabled={deleteContactMutation.isPending}
                                        style={{ width: "36px", height: "36px" }}
                                        title="Delete Contact"
                                    >
                                        <Icon icon="solar:trash-bin-trash-linear" width={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-top d-flex flex-column gap-1">
                                <div className="d-flex align-items-center text-muted small">
                                    <Icon icon="solar:phone-linear" className="me-2 text-primary" />
                                    <span>{contact.mobile}</span>
                                </div>
                                {contact.email && (
                                    <div className="d-flex align-items-center text-muted small">
                                        <Icon icon="solar:letter-linear" className="me-2 text-primary" />
                                        <span className="text-truncate">{contact.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmModal
                show={showConfirm}
                title="Delete Contact"
                message={`Are you sure you want to delete ${contactToDelete?.name} from your contacts? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowConfirm(false);
                    setContactToDelete(null);
                }}
                isPending={deleteContactMutation.isPending}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                .contact-card:hover {
                    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08) !important;
                    transform: translateY(-2px);
                }
                .hover-bg-danger-subtle:hover {
                    background-color: #f8d7da;
                }
                .max-w-250 { max-width: 250px; }
                .animation-slide-up {
                    animation: slideUp 0.3s ease-out forwards;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .border-dashed {
                    border-style: dashed !important;
                    border-width: 2px !important;
                }
            ` }} />
        </div>
    );
};

export default ContactList;
