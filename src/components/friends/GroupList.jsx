import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useGroups } from "../../hooks/friends/useGroups";
import AlertBox from "../ui/Alert";
import ConfirmModal from "../common/ConfirmModal";

export default function GroupList() {
    const { groups, isLoading, deleteGroup, isDeleting } = useGroups();
    const [alert, setAlert] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);

    const handleDeleteClick = (id, name) => {
        setGroupToDelete({ id, name });
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!groupToDelete) return;
        try {
            await deleteGroup(groupToDelete.id);
            setAlert({ type: "success", message: "Group deleted successfully" });
            setShowConfirm(false);
            setGroupToDelete(null);
        } catch (error) {
            setAlert({ type: "danger", message: "Failed to delete group" });
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                <Icon icon="solar:users-group-rounded-linear" className="fs-1 text-muted mb-3" />
                <h5 className="text-muted">No groups created yet</h5>
                <p className="text-secondary small">Create a group to easily invite multiple people to your events.</p>
            </div>
        );
    }

    return (
        <div className="groups-container">
            {alert && <div className="mb-4"><AlertBox type={alert.type} message={alert.message} onClose={() => setAlert(null)} /></div>}

            <div className="row g-4">
                {groups.map((group) => (
                    <div key={group._id} className="col-12 col-md-6 col-xl-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                            <div className="card-header bg-white border-bottom p-20 d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="fw-bold mb-1 text-dark">{group.name}</h6>
                                    <p className="text-muted small mb-0">{group.description || "No description"}</p>
                                </div>
                                <button
                                    className="btn btn-outline-danger btn-sm border-0 bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center p-0"
                                    style={{ width: "32px", height: "32px" }}
                                    onClick={() => handleDeleteClick(group._id, group.name)}
                                    disabled={isDeleting}
                                >
                                    <Icon icon="mdi:delete-outline" className="fs-5" />
                                </button>
                            </div>
                            <div className="card-body p-20">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <Icon icon="solar:users-group-two-rounded-linear" className="text-primary" />
                                    <span className="fw-semibold small text-dark">{group.members?.length || 0} Members</span>
                                </div>
                                <div className="members-list overflow-auto" style={{ maxHeight: "150px" }}>
                                    <div className="d-flex flex-wrap gap-2">
                                        {group.members?.map((member, idx) => (
                                            <div key={idx} className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-1 border small">
                                                <Icon
                                                    icon={member.memberType === "User" ? "mdi:account-star" : "mdi:account-circle"}
                                                    className={member.memberType === "User" ? "text-primary" : "text-secondary"}
                                                />
                                                <span className="text-dark">{member.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-light border-top p-12 text-center">
                                <small className="text-muted">Created {new Date(group.createdAt).toLocaleDateString()}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmModal
                show={showConfirm}
                title="Delete Group"
                message={`Are you sure you want to delete "${groupToDelete?.name}"? All group data will be lost.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowConfirm(false);
                    setGroupToDelete(null);
                }}
                isPending={isDeleting}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-scale { transition: transform 0.2s; }
                .hover-scale:hover { transform: scale(1.02); }
                .members-list::-webkit-scrollbar { width: 4px; }
                .members-list::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
            ` }} />
        </div>
    );
}
