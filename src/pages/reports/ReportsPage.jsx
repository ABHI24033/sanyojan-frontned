import React, { useEffect, useState } from 'react';
import MasterLayout from '../../masterLayout/MasterLayout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { getMyEvents, getReceivedInvitations } from '../../api/event';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ReportsPage = () => {
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);

    useEffect(() => {
        fetchEventData();
    }, []);

    const fetchEventData = async () => {
        setEventsLoading(true);
        try {
            const createdRes = await getMyEvents({ limit: 100 });
            const createdEvents = (createdRes.data || createdRes).map(e => ({ ...e, myRole: 'Host', status: 'Created' }));

            const [pending, replied, history] = await Promise.all([
                getReceivedInvitations('pending'),
                getReceivedInvitations('replied'),
                getReceivedInvitations('history')
            ]);

            const allInvited = [...pending, ...replied, ...history];
            const uniqueInvited = Array.from(new Map(allInvited.map(item => [item._id, item])).values());
            const formattedInvited = uniqueInvited.map(e => ({ ...e, myRole: 'Guest' }));

            const createdIds = new Set(createdEvents.map(e => e._id));
            const finalInvited = formattedInvited.filter(e => !createdIds.has(e._id));

            const allEvents = [...createdEvents, ...finalInvited];
            allEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

            setEvents(allEvents);
        } catch (error) {
            console.error("Failed to load events data", error);
        } finally {
            setEventsLoading(false);
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Reports" />

            <div className="card h-100 p-0 radius-12 border-0 shadow-sm">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">My Events & Reports</h6>
                </div>
                <div className="card-body p-24">
                    {eventsLoading ? (
                        <div className="d-flex justify-content-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-5">
                            <Icon icon="solar:document-text-linear" className="fs-48 text-muted mb-2" />
                            <h5 className="text-muted">No events found</h5>
                        </div>
                    ) : (
                        <div className="row gy-4">
                            {events.map((event) => (
                                <div key={event._id} className="col-xxl-4 col-lg-6 col-md-6">
                                    <div className="card h-100 p-0 shadow-none border bg-transparent radius-12 hover-scale-sm transition-all">
                                        <div className="card-body p-3 d-flex flex-column h-100">
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <img
                                                    src={event.coverImage || '/assets/images/default-event.jpg'}
                                                    className="w-56-px h-56-px rounded-circle object-fit-cover flex-shrink-0"
                                                    alt=""
                                                />
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <h6 className="text-md mb-1 fw-bold text-truncate">{event.eventName}</h6>
                                                    <div className="d-flex align-items-center gap-1 text-secondary-light text-xs">
                                                        <span className="badge bg-primary-50 text-primary-600 radius-4 px-2 py-0.5">{event.eventType}</span>
                                                        <span className="text-truncate">• {format(new Date(event.startDate), 'MMM d, yyyy')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <span className={`badge px-2 py-1 ${event.myRole === 'Host' ? 'text-primary-600 bg-primary-50' : 'text-info-600 bg-info-50'} radius-4`}>
                                                        {event.myRole}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-dashed border-gray-200">
                                                <div className="d-flex flex-column">
                                                    <span className="text-secondary-light text-xs">Your Status</span>
                                                    {event.myRole === 'Host' ? (
                                                        <span className="badge text-success-600 bg-success-50 px-2 py-1 radius-4 w-fit-content mt-1">Created</span>
                                                    ) : (
                                                        <span className={`badge px-2 py-1 radius-4 w-fit-content mt-1 ${event.status === 'accepted' ? 'text-success-600 bg-success-50' :
                                                            event.status === 'rejected' ? 'text-danger-600 bg-danger-50' :
                                                                event.status === 'maybe' ? 'text-info-600 bg-info-50' :
                                                                    'text-warning-600 bg-warning-50'
                                                            }`}>
                                                            {(!event.status || event.status === 'unknown') ? 'Pending' : event.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-end">
                                                    <span className="text-secondary-light text-xs d-block">Time</span>
                                                    <span className="text-sm fw-medium text-primary-light">{event.startTime}</span>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="text-secondary-light text-xs fw-medium">Guest Summary</span>
                                                    <span className="text-primary-600 text-xs fw-bold">Total: {event.guestStats ? event.guestStats.total : 0}</span>
                                                </div>
                                                {event.guestStats ? (
                                                    <div className="d-flex gap-2">
                                                        <div className="d-flex align-items-center gap-1 bg-success-50 text-success-600 px-2 py-1 radius-4" title="Accepted">
                                                            <Icon icon="solar:check-circle-bold" className="text-sm" />
                                                            <span className="text-xs fw-bold">{event.guestStats.accepted}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1 bg-danger-50 text-danger-600 px-2 py-1 radius-4" title="Rejected">
                                                            <Icon icon="solar:close-circle-bold" className="text-sm" />
                                                            <span className="text-xs fw-bold">{event.guestStats.rejected}</span>
                                                        </div>
                                                    </div>
                                                ) : <span className="text-xs text-muted">No guest data</span>}
                                            </div>

                                            <div className="mt-auto">
                                                <Link
                                                    to={`/reports/event/${event._id}`}
                                                    className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center gap-2 radius-8"
                                                >
                                                    <Icon icon="solar:chart-square-linear" className="text-lg" />
                                                    View Full Report
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MasterLayout >
    );
};

export default ReportsPage;

