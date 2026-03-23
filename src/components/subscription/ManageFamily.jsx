import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { getFamilyMembers, addFamilyMember } from "../../api/subscription";
import { useAuth } from "../../context/AuthContext";

const ManageFamily = () => {
    const { user, isProActive } = useAuth();
    const [familyMembers, setFamilyMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [invitePhone, setInvitePhone] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchFamilyMembers();
    }, []);

    const fetchFamilyMembers = async () => {
        try {
            setLoading(true);
            const res = await getFamilyMembers();
            if (res.success) {
                setFamilyMembers(res.family_members);
            }
        } catch (err) {
            console.error("Failed to fetch family:", err);
            setError("Failed to load family members");
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!invitePhone || invitePhone.trim().length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        try {
            setInviteLoading(true);
            const res = await addFamilyMember(invitePhone);
            if (res.success) {
                setSuccess('Family member added successfully!');
                setInvitePhone('');
                fetchFamilyMembers();
            }
        } catch (err) {
            setError(err.message || 'Failed to add family member');
        } finally {
            setInviteLoading(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm mt-4">
            <div className="card-body p-20">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <Icon icon="mdi:account-group" className="text-primary" width={24} />
                    Manage Family Account sharing
                </h6>

                {user?.primary_account_id ? (
                    <div className="alert alert-info">
                        <Icon icon="mdi:information" className="me-2" />
                        You are part of a family plan managed by another user.
                    </div>
                ) : (
                    <>
                        <p className="text-muted small mb-4">
                            Share your Pro Subscription or active Free Trial with your family members. Added members get Full Access automatically.
                        </p>

                        <div className="row mb-4">
                            <div className="col-md-8 col-lg-6">
                                <form onSubmit={handleAddMember} className="d-flex gap-2">
                                    <input
                                        type="tel"
                                        className="form-control"
                                        placeholder="Enter registered 10-digit phone number"
                                        value={invitePhone}
                                        onChange={(e) => setInvitePhone(e.target.value.replace(/\D/g, '').substring(0, 10))}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary d-flex align-items-center gap-2 text-nowrap"
                                        disabled={inviteLoading}
                                    >
                                        {inviteLoading ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <><Icon icon="mdi:plus" /> Add Member</>
                                        )}
                                    </button>
                                </form>
                                {error && <div className="text-danger small mt-2">{error}</div>}
                                {success && <div className="text-success small mt-2">{success}</div>}
                            </div>
                        </div>

                        <h6 className="fw-semibold mb-3">Linked Family Members ({familyMembers.length})</h6>

                        {loading ? (
                            <div className="d-flex justify-content-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : familyMembers.length === 0 ? (
                            <div className="text-center py-4 bg-light rounded text-muted">
                                No family members linked yet.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {familyMembers.map((member) => (
                                            <tr key={member._id}>
                                                <td>
                                                    <div className="fw-medium">{member.firstname} {member.lastname}</div>
                                                </td>
                                                <td>{member.country_code || '+91'} {member.phone}</td>
                                                <td>
                                                    {member.is_verified ? (
                                                        <span className="badge bg-success-subtle text-success">Verified</span>
                                                    ) : (
                                                        <span className="badge bg-warning-subtle text-warning">Pending</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageFamily;
