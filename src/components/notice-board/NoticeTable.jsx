import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";
import { formatDate } from "../../helper/DateFormatter";
import EditNoticeModal from "./EditNoticeModal";

export default function NoticeTable({
    notices,
    onDelete,
    openEditModal,
    closeEditModal,
    editModal,
    onView,
    onEdit,
    onTogglePin = () => { },
}) {
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedId) {
            onDelete(selectedId);
        }
        setShowConfirmModal(false);
        setSelectedId(null);
    };

    const handleViewClick = (notice) => {
        if (onView) {
            onView(notice);
        } else {
            navigate(`/notice/${notice._id}`);
        }
    };

    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">Manage Notices</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive" style={{ minHeight: "300px" }}>
                        <table className="table bordered-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Sl No.</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Pinned</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Created</th>
                                    <th scope="col">Expiry Date</th>
                                    <th scope="col" className="text-end">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {notices?.length > 0 ? (
                                    notices.map((notice, index) => (
                                        <tr key={notice._id}>
                                            <td>
                                                <span className="text-secondary-light">{index + 1}</span>
                                            </td>

                                            <td>
                                                <span
                                                    className="text-primary-light fw-semibold text-truncate d-block"
                                                    style={{ maxWidth: "250px" }}
                                                >
                                                    {notice.title}
                                                </span>
                                            </td>

                                            <td>
                                                {notice.isPinned ? (
                                                    <span className="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm">
                                                        Pinned
                                                    </span>
                                                ) : (
                                                    <span className="bg-secondary-focus text-secondary-main px-24 py-4 rounded-pill fw-medium text-sm">No</span>
                                                )}
                                            </td>

                                            <td>
                                                {notice.status === "Active" && (
                                                    <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">Active</span>
                                                )}

                                                {notice.status === "Inactive" && (
                                                    <span className="bg-danger-focus text-danger-main px-24 py-4 rounded-pill fw-medium text-sm">Inactive</span>
                                                )}

                                                {notice.status === "Expired" && (
                                                    <span className="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm">Expired</span>
                                                )}
                                            </td>


                                            <td><span className="text-secondary-light">{formatDate(notice.createdAt)}</span></td>
                                            <td><span className="text-secondary-light">{formatDate(notice.createdAt)}</span></td>

                                            {/* Actions menu */}
                                            <td className="text-end">
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-sm btn-light border radius-8 d-flex align-items-center justify-content-center p-0"
                                                        style={{ width: '32px', height: '32px' }}
                                                        data-bs-toggle="dropdown"
                                                        data-bs-display="static"
                                                    >
                                                        <Icon icon="ri:more-2-fill" width="18" className="text-secondary-light" />
                                                    </button>

                                                    <ul className="dropdown-menu dropdown-menu-end">

                                                        {/* View */}
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center text-secondary-light hover-text-primary-600 gap-2"
                                                                onClick={() => handleViewClick(notice)}
                                                            >
                                                                <Icon icon="ri-eye-fill" width="20" />
                                                                View
                                                            </button>
                                                        </li>

                                                        {/* Edit */}
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center text-secondary-light hover-text-primary-600 gap-2"
                                                                onClick={() => openEditModal(notice)}
                                                            >
                                                                <Icon
                                                                    icon="ri-edit-box-fill"
                                                                    width="20"
                                                                />
                                                                Edit
                                                            </button>
                                                        </li>

                                                        {/* Pin / Unpin */}
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center text-secondary-light hover-text-primary-600 gap-2"
                                                                onClick={() => onTogglePin(notice?._id)}
                                                            >
                                                                <Icon
                                                                    icon="ri-pushpin-fill"
                                                                    width="20"
                                                                />
                                                                {notice.isPinned ? "Unpin" : "Pin"}
                                                            </button>
                                                        </li>

                                                        <li>
                                                            <hr className="dropdown-divider" />
                                                        </li>

                                                        {/* Delete */}
                                                        <li>
                                                            <button
                                                                className="dropdown-item text-danger d-flex align-items-center gap-2"
                                                                onClick={() => handleDeleteClick(notice._id)}
                                                            >
                                                                <Icon
                                                                    icon="ri-delete-bin-6-fill"
                                                                    width="20"
                                                                />
                                                                Delete
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center">
                                                <Icon icon="solar:document-text-outline" className="fs-48 text-muted mb-2" />
                                                <p className="text-muted mb-0">No notices found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                show={showConfirmModal}
                onCancel={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Notice"
                message="Are you sure you want to delete this notice?"
            />
            <EditNoticeModal
                show={editModal.show}
                onClose={closeEditModal}
                data={editModal.data}
                onUpdate={onEdit}
            />
        </div>
    );
}

