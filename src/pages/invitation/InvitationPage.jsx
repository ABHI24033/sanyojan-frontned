import React, { useEffect, useState } from 'react';
import MasterLayout from '../../masterLayout/MasterLayout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { getMyEvents } from '../../api/event';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const InvitationPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSentInvitations = async () => {
        setLoading(true);
        try {
            const res = await getMyEvents({ limit: 50 });
            setEvents(res.data);
        } catch (err) {
            console.error("Failed to fetch sent invitations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSentInvitations();
    }, []);

    const renderCard = (event) => (
        <div key={event._id} className="col-xxl-4 col-lg-6 col-md-6">
            <div className="card h-100 shadow-sm border-0 radius-12 hover-scale-sm transition-all">
                <div className="position-relative">
                    <img
                        src={event.coverImage || '/assets/images/default-event.jpg'}
                        className="card-img-top object-fit-cover radius-12-top"
                        alt={event.eventName}
                        style={{ height: '180px', width: '100%' }}
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Event'; }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                        <span className={`badge ${event.eventType === 'inperson' ? 'bg-primary-600' : 'bg-info-600'} px-2 py-1 radius-4`}>
                            {event.eventType === 'inperson' ? 'In-Person' : 'Virtual'}
                        </span>
                    </div>
                </div>
                <div className="card-body p-3 d-flex flex-column">
                    <h5 className="card-title fw-bold text-primary-light mb-3">
                        {event.eventName}
                    </h5>

                    <div className="d-flex align-items-center gap-2 text-secondary-light mb-2">
                        <Icon icon="solar:calendar-bold" className="text-lg" />
                        <span className="text-sm">
                            {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                        </span>
                    </div>

                    {event.location && (
                        <div className="d-flex align-items-center gap-2 text-secondary-light mb-3">
                            <Icon icon="solar:map-point-bold" className="text-lg" />
                            <span className="text-sm text-truncate">{event.location}</span>
                        </div>
                    )}

                    {/* Guest Stats Summary */}
                    <div className="bg-neutral-100 p-3 radius-8 mb-3">
                        <p className="text-xs fw-bold text-secondary-light mb-2 text-uppercase">Guest Status</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="text-center">
                                <p className="text-xs text-muted mb-0">Total</p>
                                <h6 className="mb-0 fw-bold">{event.guestStats?.total || 0}</h6>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-success mb-0">Accepted</p>
                                <h6 className="mb-0 fw-bold text-success">{event.guestStats?.accepted || 0}</h6>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-warning mb-0">Pending</p>
                                <h6 className="mb-0 fw-bold text-warning">{event.guestStats?.pending || 0}</h6>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-danger mb-0">Rejected</p>
                                <h6 className="mb-0 fw-bold text-danger">{event.guestStats?.rejected || 0}</h6>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-2 d-flex flex-column gap-2">
                        <Link
                            to={`/events/${event._id}`}
                            className="btn btn-outline-primary w-100"
                        >
                            View Details
                        </Link>
                        {/* <Link
                            to={`/my-guests/event-guest/${event._id}`}
                            className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
                        >
                            <Icon icon="solar:users-group-rounded-bold" />
                            View Guest List
                        </Link> */}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <MasterLayout>
            <Breadcrumb title="Sent Invitations" />

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-5">
                    <Icon icon="solar:letter-linear" className="fs-48 text-muted mb-2" />
                    <h5 className="text-muted">No sent invitations found</h5>
                    <p className="text-secondary-light">You haven't sent any invitations yet.</p>
                    <Link to="/create-event" className="btn btn-primary mt-3">
                        Create Event
                    </Link>
                </div>
            ) : (
                <div className="row gy-4">
                    {events.map(renderCard)}
                </div>
            )}
        </MasterLayout>
    );
};

export default InvitationPage;
