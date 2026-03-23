import React, { useState } from 'react';
import MasterLayout from '../../masterLayout/MasterLayout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { getMyEvents, getEventAttendance } from '../../api/event';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import EventAttendanceTable from '../../components/event/EventAttendanceTable';

const EventManagementAttendance = () => {
    const [selectedEventId, setSelectedEventId] = useState(null);

    // Fetch Host's Events
    const { data: myEvents, isLoading: eventsLoading } = useQuery({
        queryKey: ['myEventsForAttendance'],
        queryFn: () => getMyEvents({ limit: 100 }),
    });

    const events = myEvents?.data || myEvents || [];

    // Fetch Attendance for Selected Event
    const { data: attendance, isLoading: attendanceLoading } = useQuery({
        queryKey: ['eventAttendance', selectedEventId],
        queryFn: () => getEventAttendance(selectedEventId),
        enabled: !!selectedEventId,
    });

    const selectedEvent = events.find(e => e._id === selectedEventId);

    const totalInvitations = selectedEvent ? (selectedEvent.guests?.length || 0) + (selectedEvent.externalGuests?.length || 0) : 0;
    const totalPresent = attendance?.length || 0;

    return (
        <MasterLayout>
            <Breadcrumb title="Attendance in Event" />

            <div className="row gy-4">
                {/* Event Selector Card */}
                <div className="col-12 col-xxl-4">
                    <div className="card h-100 p-0 radius-12 border-0 shadow-sm">
                        <div className="card-header border-bottom bg-base py-16 px-24">
                            <h6 className="text-lg fw-semibold mb-0">Select Event</h6>
                        </div>
                        <div className="card-body p-24">
                            {eventsLoading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                </div>
                            ) : events.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <Icon icon="solar:calendar-sad-linear" className="fs-1 mb-2" />
                                    <p>No events created yet.</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {events.map((event) => (
                                        <div
                                            key={event._id}
                                            className={`p-16 radius-12 cursor-pointer transition-all border ${selectedEventId === event._id ? 'bg-primary-50 border-primary-600 shadow-sm' : 'bg-transparent border-gray-100 hover-bg-light'}`}
                                            onClick={() => setSelectedEventId(event._id)}
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <div className={`w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center ${selectedEventId === event._id ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-600'}`}>
                                                    <Icon icon="solar:calendar-mark-bold" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h6 className="text-sm mb-1 fw-bold text-truncate">{event.eventName}</h6>
                                                    <span className="text-xs text-secondary-light">{format(new Date(event.startDate), 'MMM d, yyyy')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dashboard Metrics and Table */}
                <div className="col-12 col-xxl-8">
                    {!selectedEventId ? (
                        <div className="card h-100 p-0 radius-12 border-0 shadow-sm d-flex justify-content-center align-items-center min-vh-50">
                            <div className="text-center p-24">
                                <Icon icon="solar:chart-square-linear" className="fs-48 text-muted mb-3 opacity-25" />
                                <h5 className="text-muted">Select an event to view attendance dashboard</h5>
                                <p className="text-secondary-light small">Total Present vs. Total Invitations analysis</p>
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-4">
                            {/* Summary Stats */}
                            <div className="row gy-4">
                                <div className="col-sm-6">
                                    <div className="card px-24 py-20 rounded-12 border-0 shadow-none bg-primary-50">
                                        <div className="card-body p-0">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <p className="fw-medium text-primary-light mb-1">Total Invitations</p>
                                                    <h4 className="fw-bold mb-0">{totalInvitations}</h4>
                                                </div>
                                                <div className="w-48-px h-48-px d-flex justify-content-center align-items-center rounded-circle bg-primary-600 text-white">
                                                    <Icon icon="solar:users-group-rounded-bold" width="24" height="24" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card px-24 py-20 rounded-12 border-0 shadow-none bg-success-50">
                                        <div className="card-body p-0">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <p className="fw-medium text-success-main mb-1">Total Present</p>
                                                    <h4 className="fw-bold mb-0">{totalPresent}</h4>
                                                </div>
                                                <div className="w-48-px h-48-px d-flex justify-content-center align-items-center rounded-circle bg-success-600 text-white">
                                                    <Icon icon="solar:check-circle-bold" width="24" height="24" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Table */}
                            <EventAttendanceTable attendance={attendance} isLoading={attendanceLoading} />
                        </div>
                    )}
                </div>
            </div>
        </MasterLayout>
    );
};

export default EventManagementAttendance;
