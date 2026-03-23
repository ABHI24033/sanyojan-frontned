import React, { useEffect, useState } from 'react';
import MasterLayout from '../../masterLayout/MasterLayout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { getMyEvents } from '../../api/event';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const MyGuestsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch User's Events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await getMyEvents({ limit: 50 });
                setEvents(res.data);
            } catch (err) {
                console.error("Failed to fetch events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);


    return (
        <MasterLayout>
            <Breadcrumb title="My Guests - Select Event" />

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-5">
                    <div className="d-flex flex-column align-items-center">
                        <Icon icon="solar:calendar-linear" className="fs-48 text-muted mb-2" />
                        <h5 className="text-muted">No events found</h5>
                        <p className="text-secondary-light">Create an event to start managing guests.</p>
                        <Link to="/create-event" className="btn btn-primary mt-3">
                            Create Event
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="row gy-4">
                    {events.map((event) => (
                        <div key={event._id} className="col-xxl-3 col-lg-4 col-sm-6">
                            <div className="card h-100 shadow-sm border-0 radius-12 hover-scale-sm transition-all">
                                <div className="position-relative">
                                    <img
                                        src={event.coverImage || '/assets/images/default-event.jpg'} // Fallback image needed? using placeholder or valid path if exists
                                        className="card-img-top object-fit-cover radius-12-top"
                                        alt={event.eventName}
                                        style={{ height: '160px', width: '100%' }}
                                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Event'; }}
                                    />
                                    <span className={`position-absolute top-0 end-0 m-3 badge ${event.eventType === 'inperson' ? 'bg-primary-600' : 'bg-info-600'} px-2 py-1 radius-4`}>
                                        {event.eventType === 'inperson' ? 'In-Person' : 'Virtual'}
                                    </span>
                                </div>
                                <div className="card-body p-3 d-flex flex-column">
                                    <h5 className="card-title fw-bold text-primary-light mb-2 text-truncate-2-lines" style={{ minHeight: '3rem' }}>
                                        {event.eventName}
                                    </h5>

                                    <div className="d-flex align-items-center gap-2 text-secondary-light mb-1">
                                        <Icon icon="solar:calendar-bold" />
                                        <span className="text-sm">{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-secondary-light mb-3">
                                        <Icon icon="solar:clock-circle-bold" />
                                        <span className="text-sm">{event.startTime} - {event.endTime}</span>
                                    </div>

                                    <div className="mt-auto pt-3 border-top">
                                        <Link
                                            to={`/my-guests/event-guest/${event._id}`}
                                            className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center gap-2"
                                        >
                                            <Icon icon="solar:users-group-rounded-bold" />
                                            View Guest List
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </MasterLayout>
    );
};

export default MyGuestsPage;

