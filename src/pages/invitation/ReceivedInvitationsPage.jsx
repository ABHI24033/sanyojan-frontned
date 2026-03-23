import React, { useEffect, useState } from 'react';
import MasterLayout from '../../masterLayout/MasterLayout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { getReceivedInvitations } from '../../api/event';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ReceivedInvitationsPage = () => {
    const [allInvitations, setAllInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, pending, responded

    const fetchInvitations = async () => {
        setLoading(true);
        try {
            // Fetch all invitations once, then filter on the client
            const data = await getReceivedInvitations("");
            setAllInvitations(data);
        } catch (err) {
            console.error("Failed to fetch received invitations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted': return <span className="badge bg-success-50 text-success-600 px-2 py-1 radius-4">Accepted</span>;
            case 'rejected': return <span className="badge bg-danger-50 text-danger-600 px-2 py-1 radius-4">Rejected</span>;
            case 'maybe': return <span className="badge bg-info-50 text-info-600 px-2 py-1 radius-4">Maybe</span>;
            default: return <span className="badge bg-warning-50 text-warning-600 px-2 py-1 radius-4">Pending</span>;
        }
    };

    const renderCard = (invitation) => {
        const event = invitation.event || invitation;
        const organizer = event.createdBy;
        const isOrganizerLoaded = organizer && typeof organizer === 'object';
        const organizerPhoto = organizer?.profile?.profilePicture || organizer?.avatar;

        return (
            <div key={invitation._id} className="col-xxl-4 col-lg-6 col-md-6 mb-4">
                <div className="card h-100 p-16 shadow-sm border-0 radius-16 hover-scale-sm transition-all overflow-hidden bg-white">
                    <div className="position-relative">
                        <img
                            src={event.coverImage || '/assets/images/default-event.jpg'}
                            className="card-img-top object-fit-cover"
                            alt={event.eventName}
                            style={{ height: '180px', width: '100%' }}
                            onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Event'; }}
                        />
                        <div className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2 align-items-end">
                            <span className={`badge ${event.eventType === 'inperson' ? 'bg-primary-600' : 'bg-info-600'} px-2 py-1 radius-4 shadow-sm border border-white border-opacity-25`}>
                                {event.eventType === 'inperson' ? 'In-Person' : 'Virtual'}
                            </span>
                            <div className="shadow-sm">{getStatusBadge(invitation.status)}</div>
                        </div>

                        {/* Organizer Info Overlay */}
                        <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark-transparent">
                            <div className="d-flex align-items-center gap-2">
                                <img
                                    src={organizerPhoto || '/assets/images/default-avatar.png'}
                                    className="radius-circle border border-2 border-white"
                                    width={32}
                                    height={32}
                                    alt="organizer"
                                    onError={(e) => { e.target.src = '/assets/images/default-avatar.png'; }}
                                />
                                <span className="text-white text-xs fw-medium shadow-text">
                                    Invited by {isOrganizerLoaded ? `${organizer.firstname} ${organizer.lastname}` : 'Family Member'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card-body p-4 d-flex flex-column">
                        <h5 className="card-title fw-bold text-primary-light mb-3 text-truncate-2">
                            {event.eventName}
                        </h5>

                        <div className="row g-2 mb-3">
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-2 text-secondary-light">
                                    <Icon icon="solar:calendar-bold-duotone" className="text-lg text-primary" />
                                    <span className="text-xs fw-medium">
                                        {format(new Date(event.startDate), 'MMM dd, yyyy')}
                                    </span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-2 text-secondary-light">
                                    <Icon icon="solar:clock-circle-bold-duotone" className="text-lg text-primary" />
                                    <span className="text-xs fw-medium">{event.startTime}</span>
                                </div>
                            </div>
                        </div>

                        {event.location && event.eventType === 'inperson' && (
                            <div className="d-flex align-items-center gap-2 text-secondary-light mb-4 bg-light p-2 radius-8">
                                <Icon icon="solar:map-point-bold-duotone" className="text-lg text-primary" />
                                <span className="text-xs text-truncate fw-medium">{event.location}</span>
                            </div>
                        )}

                        <div className="mt-auto pt-3 d-flex gap-2">
                            <Link
                                to={`/events/${event._id}`}
                                className="btn btn-primary w-100 radius-12 fw-bold py-6 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                            >
                                <Icon icon="solar:eye-bold-duotone" width={18} />
                                View Details & RSVP
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Derived lists for tabs
    const pendingInvitations = allInvitations.filter((invitation) => {
        const status = invitation.status || 'pending';
        return status === 'pending';
    });

    const respondedInvitations = allInvitations.filter((invitation) => {
        const status = invitation.status || 'pending';
        return status === 'accepted' || status === 'rejected' || status === 'maybe';
    });

    const displayedInvitations =
        activeTab === 'pending'
            ? pendingInvitations
            : activeTab === 'responded'
                ? respondedInvitations
                : allInvitations;

    return (
        <MasterLayout>
            <Breadcrumb title="My Event Invitations" />

            <div className="card border-0 shadow-sm radius-12 mb-4 overflow-hidden">
                <div className="card-body p-0">
                    <div className="d-flex hide-scrollbar overflow-x-auto bg-light bg-opacity-50">
                        <button
                            className={`flex-grow-1 py-3 px-4 d-flex justify-content-center align-items-center fw-bold border-0 transition-all ${activeTab === 'all' ? 'bg-white text-primary border-bottom border-3 border-primary shadow-sm' : 'bg-transparent text-muted'}`}
                            onClick={() => setActiveTab('all')}
                        >
                            <Icon icon="solar:inbox-bold-duotone" className="me-2" />
                            My Invitations ({allInvitations.length})
                        </button>
                        <button
                            className={`flex-grow-1 py-3 px-4 d-flex justify-content-center align-items-center fw-bold border-0 transition-all ${activeTab === 'pending' ? 'bg-white text-primary border-bottom border-3 border-primary shadow-sm' : 'bg-transparent text-muted'}`}
                            onClick={() => setActiveTab('pending')}
                        >
                            <Icon icon="solar:letter-unread-bold-duotone" className="me-2" />
                            Pending Invitations ({pendingInvitations.length})
                        </button>
                        <button
                            className={`flex-grow-1 py-3 px-4 d-flex justify-content-center align-items-center fw-bold border-0 transition-all ${activeTab === 'responded' ? 'bg-white text-primary border-bottom border-3 border-primary shadow-sm' : 'bg-transparent text-muted'}`}
                            onClick={() => setActiveTab('responded')}
                        >
                            <Icon icon="solar:letter-opened-bold-duotone" className="me-2" />
                            Responded Invitations ({respondedInvitations.length})
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : displayedInvitations.length === 0 ? (
                <div className="text-center py-5 bg-white radius-12 shadow-sm border border-dashed">
                    <div className="mb-3">
                        <Icon icon="solar:letter-linear" className="fs-1 text-muted opacity-25" style={{ fontSize: '80px' }} />
                    </div>
                    <h5 className="text-muted fw-bold">No invitations found</h5>
                    <p className="text-secondary-light">You don't have any invitation in this category yet.</p>
                </div>
            ) : (
                <div className="row gy-4">
                    {displayedInvitations.map(renderCard)}
                </div>
            )}
        </MasterLayout>
    );
};

export default ReceivedInvitationsPage;
