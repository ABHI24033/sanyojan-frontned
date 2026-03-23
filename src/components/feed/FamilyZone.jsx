import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAdministrators } from '../../api/roles';
import { useAuth } from '../../context/AuthContext';

const FamilyZone = () => {
    const { user } = useAuth();

    const { data: adminData, isLoading: isAdminLoading } = useQuery({
        queryKey: ['administrators'],
        queryFn: getAdministrators,
        staleTime: 60 * 1000,
    });

    const admin = adminData?.data?.admin || null;
    const subAdmins = adminData?.data?.subAdmins || [];
    const coordinators = adminData?.data?.coordinators || [];

    const placeholderAvatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

    return (
        <div className="card shadow-sm border-0 mt-20 rounded-4">
            <div className="card-body py-10">
                <div className="mb-4">
                    <div className="d-flex mb-4 align-items-center justify-content-between">
                        <h6 className="fw-bold fs-5 mb-10">Administrator</h6>
                        {(user?.isAdmin || user?.isSuperAdmin) && (
                            <Link to="/settings/manage-subadmin" className="text-decoration-none text-xs fw-semibold text-primary">
                                Manage
                            </Link>
                        )}
                    </div>

                    {isAdminLoading ? (
                        <div className="text-center py-2">
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="d-grid gap-2">
                            {admin && (
                                <div className="d-flex align-items-center px-3 py-10 rounded-3 bg-light border">
                                    <img
                                        src={admin.profilePicture || placeholderAvatar}
                                        alt={admin.name}
                                        width="36"
                                        height="36"
                                        className="rounded-circle me-3 border"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold text-sm text-dark">{admin.name}</div>
                                        <span className="badge bg-warning-subtle text-warning" style={{ fontSize: "0.7rem" }}>
                                            Main Admin
                                        </span>
                                    </div>
                                </div>
                            )}

                            {subAdmins.slice(0, 3).map((u) => (
                                <div key={u.id} className="d-flex align-items-center px-3 py-10 rounded-3 bg-white border">
                                    <img
                                        src={u.profilePicture || placeholderAvatar}
                                        alt={u.name}
                                        width="32"
                                        height="32"
                                        className="rounded-circle me-3 border"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold text-sm text-dark">{u.name}</div>
                                        <span className="badge bg-warning-subtle text-warning" style={{ fontSize: "0.65rem" }}>
                                            SubAdmin
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {coordinators.slice(0, 3).map((u) => (
                                <div key={u.id} className="d-flex align-items-center px-3 py-10 rounded-3 bg-white border">
                                    <img
                                        src={u.profilePicture || placeholderAvatar}
                                        alt={u.name}
                                        width="32"
                                        height="32"
                                        className="rounded-circle me-3 border"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold text-sm lh-1 text-dark">{u.name}</div>
                                        <span className="badge bg-info-subtle text-info" style={{ fontSize: "0.65rem" }}>
                                            Coordinator
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {!admin && subAdmins.length === 0 && coordinators.length === 0 && (
                                <div className="text-muted small">No administrators configured.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FamilyZone;
