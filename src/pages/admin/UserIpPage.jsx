import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import MasterLayout from "../../masterLayout/MasterLayout";
import { getAllUsersIp } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function UserIpPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [totalUsers, setTotalUsers] = useState(0);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsersIp(page, limit, search);
            if (response.success) {
                setUsers(response.data);
                setTotalPages(response.pagination.pages);
                setTotalUsers(response.pagination.total);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [page, search]);

    return (
        <MasterLayout>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm px-5 p rounded-4">
                            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div>
                                    <h4 className="mb-0 fw-bold fs-5 d-flex align-items-center text-primary">
                                        <Icon icon="solar:shield-user-bold-duotone" className="me-2" width={32} />
                                        User IP Tracking
                                    </h4>
                                    <p className="text-muted small mb-0 mt-1">Monitor user registration and login IP addresses.</p>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            className="form-control rounded-pill ps-5 bg-light border-0"
                                            placeholder="Search users..."
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                setPage(1); // Reset to page 1 on search
                                            }}
                                        />
                                        <Icon
                                            icon="solar:magnifer-linear"
                                            className="position-absolute text-muted"
                                            style={{ top: '50%', left: '15px', transform: 'translateY(-50%)' }}
                                            width={20}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                {loading && users.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <p className="mt-2 text-muted">Loading user data...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-5 text-danger">
                                        <Icon icon="solar:danger-triangle-linear" width={48} className="mb-3" />
                                        <p>{error}</p>
                                        <button className="btn btn-outline-primary btn-sm rounded-pill mt-2" onClick={fetchUsers}>
                                            Try Again
                                        </button>
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="text-center py-5">
                                        <Icon icon="solar:user-block-rounded-linear" width={48} className="text-muted mb-3 opacity-50" />
                                        <p className="text-muted">No users found matching your search.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="bg-light-subtle">
                                                <tr>
                                                    <th className="py-2 ps-4 border-0 text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>User</th>
                                                    <th className="py-2 border-0 text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Contact</th>
                                                    <th className="py-2 border-0 text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Registration IP</th>
                                                    <th className="py-2 border-0 text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Last Login IP</th>
                                                    <th className="py-2 border-0 text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Last Active</th>
                                                    <th className="py-2 pe-4 border-0 text-secondary text-uppercase text-end" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users?.map((u) => (
                                                    <tr key={u._id}>
                                                        <td className="ps-4 py-10 fs-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="avatar-initial rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                                                    {u.firstname?.charAt(0)}{u.lastname?.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-0 fw-semibold text-dark text-sm">{u.firstname} {u.lastname}</h6>
                                                                    <div className="d-flex gap-1 mt-1">
                                                                        {u.isSuperAdmin && <span className="badge bg-danger-subtle text-danger" style={{ fontSize: '0.65rem' }}>Super Admin</span>}
                                                                        {u.isAdmin && !u.isSuperAdmin && <span className="badge bg-warning-subtle text-warning" style={{ fontSize: '0.65rem' }}>Admin</span>}
                                                                        {!u.isAdmin && !u.isSuperAdmin && <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.65rem' }}>User</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-2">
                                                            <div className="d-flex flex-column">
                                                                <span className="text-dark fw-medium" style={{ fontSize: '0.8rem' }}>{u.country_code} {u.phone}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-2">
                                                            {u.ipAddress ? (
                                                                <span className="badge bg-white border text-secondary fw-normal px-2 py-1 rounded-2 font-monospace" style={{ fontSize: '0.75rem' }}>
                                                                    {u.ipAddress}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>-</span>
                                                            )}
                                                        </td>
                                                        <td className="py-2">
                                                            {u.lastLoginIp ? (
                                                                <span className="badge bg-white border text-secondary fw-normal px-2 py-1 rounded-2 font-monospace" style={{ fontSize: '0.75rem' }}>
                                                                    {u.lastLoginIp}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>-</span>
                                                            )}
                                                        </td>
                                                        <td className="py-2">
                                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                                {u.lastActive ? new Date(u.lastActive).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date(u.updatedAt).toLocaleDateString()}
                                                            </small>
                                                        </td>
                                                        <td className="text-end pe-4 py-2">
                                                            <Link to={`/profile?userId=${u._id}`} className="btn btn-icon btn-sm btn-light rounded-circle text-muted" style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Icon icon="solar:eye-linear" width={16} />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-white border-top py-10">
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                        Showing {users.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalUsers)} of {totalUsers} users
                                    </small>
                                    <nav>
                                        <ul className="pagination pagination-sm mb-0">
                                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link border-0 text-dark" style={{ fontSize: '0.8rem' }} onClick={() => setPage(p => Math.max(1, p - 1))}>
                                                    <Icon icon="solar:alt-arrow-left-linear" />
                                                </button>
                                            </li>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                                    <button className="page-link border-0 rounded-circle mx-1 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '0.75rem' }} onClick={() => setPage(i + 1)}>
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link border-0 text-dark" style={{ fontSize: '0.8rem' }} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                                                    <Icon icon="solar:alt-arrow-right-linear" />
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
}
