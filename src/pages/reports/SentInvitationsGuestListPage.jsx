import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MasterLayout from '../../masterLayout/MasterLayout';
import Breadcrumb from '../../components/common/Breadcrumb';
import axiosInstance from '../../api/axiosInstance';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';

const SentInvitationsGuestListPage = () => {
    const { id } = useParams();
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);

    useEffect(() => {
        fetchGuestList();
    }, [id]);

    const fetchGuestList = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/events/${id}/guest-list`, { params: { limit: 500 } });
            setGuests(res.data?.data || []);
            setEvent(res.data?.event || null);
        } catch (error) {
            console.error("Failed to load generic event guest list", error);
            setGuests([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Guest List" />

            <div className="card h-100 p-0 radius-12 border-0 shadow-sm">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <div>
                        <h6 className="text-lg fw-semibold mb-0">
                            {event ? `Guests for: ${event.eventName}` : 'Guest List'}
                        </h6>
                        {event && event.startDate && (
                            <span className="text-sm text-secondary-light">
                                {format(new Date(event.startDate), 'PPP')} at {event.startTime}
                            </span>
                        )}
                    </div>
                    <Link to="/sent-invitations" className="btn btn-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2">
                        <Icon icon="ion:arrow-back-outline" />
                        Back to Sent Invitations
                    </Link>
                </div>
                <div className="card-body p-24">
                    <div className="table-responsive">
                        <table className="table bordered-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Guest Name</th>
                                    <th scope="col" className="text-center">RSVP Status</th>
                                    <th scope="col" className="text-center">Attendees</th>
                                    <th scope="col" className="text-center">Food Pref</th>
                                    <th scope="col">Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : guests.length > 0 ? (
                                    guests
                                        .filter(guest => guest._id !== event?.createdBy)
                                        .map((guest, idx) => (
                                            <tr key={guest._id || idx}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={guest.avatar || '/assets/images/user.png'}
                                                            className="w-40-px h-40-px rounded-circle object-fit-cover me-3"
                                                            alt=""
                                                        />
                                                        <div>
                                                            <span className="text-md fw-semibold text-primary-light d-block">
                                                                {guest.name || 'Unknown'}
                                                            </span>
                                                            {guest.city && <span className="text-xs text-secondary-light">{guest.city}</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span className={`badge px-2 py-1 radius-4 ${guest.currentStatus === 'accepted' ? 'bg-success-50 text-success-600' :
                                                        guest.currentStatus === 'rejected' ? 'bg-danger-50 text-danger-600' :
                                                            guest.currentStatus === 'maybe' ? 'bg-warning-50 text-warning-600' :
                                                                'bg-secondary-50 text-secondary-600'
                                                        }`}>
                                                        {guest.currentStatus || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="text-center fw-medium pb-0">
                                                    {guest.currentStatus === 'accepted' || guest.currentStatus === 'maybe' ? guest.totalAttendees || 1 : '-'}
                                                </td>
                                                <td className="text-center pb-0">
                                                    {guest.foodPreference ? guest.foodPreference : '-'}
                                                </td>
                                                <td>
                                                    <span className="text-secondary-light text-sm">{guest.phone || 'N/A'}</span>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-secondary-light">
                                            No invitations found for this event.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default SentInvitationsGuestListPage;
