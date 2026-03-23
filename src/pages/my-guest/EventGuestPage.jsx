import React, { useEffect, useState } from 'react';
import MasterLayout from '../../masterLayout/MasterLayout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { getEventGuestList, getEventById } from '../../api/event';
import { Icon } from '@iconify/react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import GuestListTable from '../../components/my-guest/GuestListTable';

const EventGuestPage = () => {
    const navigate = useNavigate();
    const { id: eventId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    useEffect(() => {
        if (!searchParams.has('page') || !searchParams.has('limit')) {
            const newParams = new URLSearchParams(searchParams);
            if (!newParams.has('page')) newParams.set('page', '1');
            if (!newParams.has('limit')) newParams.set('limit', '10');
            setSearchParams(newParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const [stats, setStats] = useState({ totalInvited: 0, accepted: 0, pending: 0, rejected: 0, maybe: 0 });
    const [guestList, setGuestList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventName, setEventName] = useState('Event Guests');
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Guest List & Stats
                const res = await getEventGuestList(eventId, { page, limit });
                setGuestList(res.data);
                setStats(res.stats);
                setPagination(res.pagination);

                // Set Event Name from response if available, or fetch separate
                if (res.event && res.event.eventName) {
                    setEventName(res.event.eventName);
                } else {
                    // Fallback fetch if needed (though getEventGuestList should return it)
                    const eventRes = await getEventById(eventId);
                    setEventName(eventRes.eventName);
                }

            } catch (err) {
                console.error("Failed to fetch event guests", err);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchData();
        }
    }, [eventId, page, limit]);

    const handleSendThankYou = (guest) => {
        console.log("Sending thank you to:", guest);
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage, limit });
    };

    return (
        <MasterLayout>
            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <Link className="btn btn-link d-flex align-items-center text-decoration-none ps-0 text-muted fw-medium inner-shadow-sm" to={`/my-guests`}>
                            <Icon icon="mdi:arrow-left" className="me-2" width="28" height="28" />
                        </Link>
                        <h4 className="mb-0 text-primary-600 fw-bold ms-2">{eventName}</h4>
                    </div>

                    {/* <Breadcrumb title={`${eventName} Guests`} /> */}

                    {/* Stats Cards */}
                    <div className="row mb-24 gy-4">
                        <div className="col-xxl-3 col-sm-6">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-muted fw-bold mb-2" style={{ fontSize: '18px' }}>Total Invited</p>
                                            <h4 className="mb-0 fw-bold">{stats.totalInvited}</h4>
                                        </div>
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#e3f2fd'
                                            }}
                                        >
                                            <Icon icon="solar:users-group-two-rounded-bold" style={{ fontSize: '28px', color: '#2196f3' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-sm-6">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-muted fw-bold mb-2" style={{ fontSize: '18px' }}>Accepted</p>
                                            <h4 className="mb-0 fw-bold" style={{ color: '#4caf50' }}>{stats.accepted}</h4>
                                        </div>
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#e8f5e9'
                                            }}
                                        >
                                            <Icon icon="solar:check-circle-bold" style={{ fontSize: '28px', color: '#4caf50' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-sm-6">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-muted fw-bold mb-2" style={{ fontSize: '18px' }}>Pending</p>
                                            <h4 className="mb-0 fw-bold" style={{ color: '#ff9800' }}>{stats.pending}</h4>
                                        </div>
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#fff3e0'
                                            }}
                                        >
                                            <Icon icon="solar:question-circle-bold" style={{ fontSize: '28px', color: '#ff9800' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-sm-6">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-muted fw-bold mb-2" style={{ fontSize: '18px' }}>Rejected</p>
                                            <h4 className="mb-0 fw-bold" style={{ color: '#f44336' }}>{stats.rejected}</h4>
                                        </div>
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#ffebee'
                                            }}
                                        >
                                            <Icon icon="solar:close-circle-bold" style={{ fontSize: '28px', color: '#f44336' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guest List Component */}
                    <div className="row">
                        <GuestListTable
                            guestList={guestList}
                            loading={loading}
                            onSendThankYou={handleSendThankYou}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}

        </MasterLayout>
    );
};

export default EventGuestPage;
