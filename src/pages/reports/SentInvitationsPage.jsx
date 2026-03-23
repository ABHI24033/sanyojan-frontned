import React, { useEffect, useState } from 'react';
import MasterLayout from '../../masterLayout/MasterLayout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { getMyEvents } from '../../api/event';
import axiosInstance from '../../api/axiosInstance';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const SentInvitationsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEventData();
    }, []);

    const fetchEventData = async () => {
        try {
            setLoading(true);
            const res = await getMyEvents();
            const createdEvents = (res.data || res).map(e => ({ ...e, myRole: 'Host', status: 'Created' }));
            setEvents(createdEvents);
        } catch (error) {
            console.error("Failed to load events data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewList = (event) => {
        navigate(`/sent-invitations/${event._id}/guests`);
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Sent Invitations" />

            <div className="card h-100 p-0 radius-12 border-0 shadow-sm">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">Sent Invitations</h6>
                </div>
                <div className="card-body p-24">
                    {loading ? (
                        <div className="d-flex justify-content-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-5">
                            <Icon icon="solar:document-text-linear" className="fs-48 text-muted mb-2" />
                            <h5 className="text-muted">No invitations sent</h5>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table bordered-table mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">Event Name</th>
                                        <th scope="col">Event Type</th>
                                        <th scope="col">Event Date</th>
                                        <th scope="col" className="text-center">Total Guests</th>
                                        <th scope="col" className="text-center">Accepted</th>
                                        <th scope="col" className="text-center">Rejected</th>
                                        <th scope="col" className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={event.coverImage || '/assets/images/default-event.jpg'}
                                                        className="w-40-px h-40-px rounded-circle object-fit-cover flex-shrink-0 me-3"
                                                        alt=""
                                                    />
                                                    <span className="text-md fw-semibold text-primary-light">{event.eventName}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-primary-50 text-primary-600 radius-4 px-2 py-1">{event.eventType}</span>
                                            </td>
                                            <td>
                                                <span className="text-secondary-light">{format(new Date(event.startDate), 'MMM d, yyyy')}</span>
                                                <br />
                                                <span className="text-xs text-muted">{event.startTime}</span>
                                            </td>
                                            <td className="text-center fw-bold text-primary-600">
                                                {event.guestStats ? event.guestStats.total : 0}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-inline-flex align-items-center gap-1 bg-success-50 text-success-600 px-2 py-1 radius-4">
                                                    <Icon icon="solar:check-circle-bold" className="text-sm" />
                                                    <span className="text-xs fw-bold">{event.guestStats ? event.guestStats.accepted : 0}</span>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-inline-flex align-items-center gap-1 bg-danger-50 text-danger-600 px-2 py-1 radius-4">
                                                    <Icon icon="solar:close-circle-bold" className="text-sm" />
                                                    <span className="text-xs fw-bold">{event.guestStats ? event.guestStats.rejected : 0}</span>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleViewList(event)}
                                                    className="btn btn-primary-100 text-primary-600 px-12 py-6 btn-sm radius-8"
                                                >
                                                    View List
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </MasterLayout>
    );
};

export default SentInvitationsPage;
