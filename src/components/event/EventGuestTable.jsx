import React from "react";
import { Icon } from "@iconify/react";

const EventGuestTable = ({
    guests,
    guestsLoading,
    filterStatus,
    setFilterStatus,
    filterCity,
    setFilterCity,
    cities,
    searchQuery,
    setSearchQuery,
    setPage,
    pagination,
    totalGuestsCount,
    startEntry,
    endEntry,
    page,
    totalPages
}) => {
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'accepted': return 'bg-success-focus text-success-main';
            case 'rejected': return 'bg-danger-focus text-danger-main';
            case 'maybe': return 'bg-warning-focus text-warning-main';
            default: return 'bg-warning-focus text-warning-main'; // pending
        }
    };


    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex flex-wrap gap-3 justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <h6 className="text-lg fw-semibold mb-0">Guest List ({pagination.total})</h6>
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control form-control-sm ps-32"
                            placeholder="Search name, city, education, college..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ minWidth: "250px" }}
                        />
                        <Icon
                            icon="solar:magnifer-linear"
                            className="position-absolute start-0 top-50 translate-middle-y ms-10 text-secondary-light"
                            fontSize={18}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="d-flex align-items-center gap-3">
                    {/* City Filter */}
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-sm text-secondary-light fw-medium">City:</span>
                        <select
                            className="form-select form-select-sm"
                            value={filterCity}
                            onChange={(e) => setFilterCity(e.target.value)}
                            style={{ width: "auto", minWidth: "120px" }}
                        >
                            <option value="">All Cities</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div className="d-flex gap-2">
                        <button className={`btn btn-sm ${filterStatus === '' ? 'btn-primary-600' : 'btn-outline-light text-secondary-light'}`} onClick={() => { setFilterStatus(''); setPage(1); }}>All Status</button>
                        <button className={`btn btn-sm ${filterStatus === 'accepted' ? 'btn-success-600' : 'btn-outline-light text-secondary-light'}`} onClick={() => { setFilterStatus('accepted'); setPage(1); }}>Present</button>
                        <button className={`btn btn-sm ${filterStatus === 'maybe' ? 'btn-warning-600' : 'btn-outline-light text-secondary-light'}`} onClick={() => { setFilterStatus('maybe'); setPage(1); }}>Maybe</button>
                        <button className={`btn btn-sm ${filterStatus === 'rejected' ? 'btn-danger-600' : 'btn-outline-light text-secondary-light'}`} onClick={() => { setFilterStatus('rejected'); setPage(1); }}>Absent</button>
                    </div>
                </div>
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Guest Name</th>
                                <th scope="col" className="text-center">Status</th>
                                <th scope="col" className="text-center">Total Attendees</th>
                                <th scope="col" className="text-center">Veg/Non-Veg</th>
                                <th scope="col">City</th>
                                <th scope="col">Contact</th>
                                <th scope="col">Acceptance Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guestsLoading && guests.length === 0 ? (
                                <tr><td colSpan="8" className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
                            ) : guests.length > 0 ? (
                                guests.map((guest, i) => (
                                    <tr key={guest._id || i}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {guest.user?.avatar ? (
                                                    <img
                                                        src={guest.user.avatar}
                                                        alt=""
                                                        className="flex-shrink-0 me-12 radius-8 object-fit-cover"
                                                        style={{ width: '40px', height: '40px' }}
                                                    />
                                                ) : (
                                                    <div className="flex-shrink-0 me-12 radius-8 bg-info-focus text-info-main d-flex justify-content-center align-items-center fw-bold text-uppercase" style={{ width: '40px', height: '40px' }}>
                                                        {(guest.name || guest.user?.firstname || "?").charAt(0)}
                                                    </div>
                                                )}
                                                <div className="flex-grow-1">
                                                    <h6 className="text-md text-primary-light fw-semibold mb-0">
                                                        {guest.name || (guest.user ? `${guest.user.firstname} ${guest.user.lastname}` : "Guest")}
                                                    </h6>
                                                    <span className="text-sm text-secondary-light">{guest.isExternal ? "Friend/Relative" : "Family Member"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className={`${getStatusBadgeClass(guest.status)} px-24 py-4 rounded-pill fw-medium text-sm text-capitalize`}>
                                                {guest.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-md text-secondary-light fw-medium">
                                                {guest.status === 'accepted' || guest.status === 'maybe' ? guest.totalAttendees || 1 : '-'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            {guest.status === 'accepted' || guest.status === 'maybe' ? (
                                                <div className="d-flex justify-content-center gap-3">
                                                    <span className="text-success fw-bold d-flex align-items-center gap-1"><Icon icon="mdi:leaf" /> {guest.vegAttendees || 0}</span>
                                                    <span className="text-danger fw-bold d-flex align-items-center gap-1"><Icon icon="mdi:food-drumstick" /> {guest.nonVegAttendees || 0}</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            <span className="text-sm text-secondary-light">
                                                {guest.city || '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-sm text-secondary-light d-flex align-items-center gap-1">
                                                {guest.mobile || guest.user?.mobile || '-'}
                                            </span>
                                        </td>
                                        <td className="text-sm text-secondary-light">
                                            {guest.respondedAt ? new Date(guest.respondedAt).toLocaleString() : (guest.status !== 'pending' ? new Date(guest.createdAt).toLocaleString() : '-')}
                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center">
                                            <Icon icon="solar:users-group-rounded-linear" className="fs-48 text-muted mb-2" />
                                            <p className="text-muted mb-0">No guests found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalGuestsCount > 0 && (
                    <div className="d-flex align-items-center justify-content-between mt-4 flex-wrap gap-3">
                        <div className="text-secondary-light text-sm">
                            Showing {startEntry} to {endEntry} of {totalGuestsCount} entries
                        </div>
                        <ul className="pagination d-flex align-items-center mb-0 gap-1">
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link w-32-px h-32-px d-flex justify-content-center align-items-center rounded-circle bg-neutral-200 text-secondary-light hover-bg-primary-600 hover-text-white border-0 p-0"
                                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    disabled={page === 1}
                                >
                                    <Icon icon="iconamoon:arrow-left-2-light" style={{ fontSize: '24px' }} />
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={`page-item`}>
                                    <button
                                        className={`page-link w-32-px h-32-px d-flex justify-content-center align-items-center rounded-circle border-0 ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-secondary-light hover-bg-primary-600 hover-text-white'}`}
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link w-32-px h-32-px d-flex justify-content-center align-items-center rounded-circle bg-neutral-200 text-secondary-light hover-bg-primary-600 hover-text-white border-0 p-0"
                                    onClick={() => {
                                        if (page < totalPages) {
                                            setPage(old => old + 1);
                                        }
                                    }}
                                    disabled={page === totalPages}
                                >
                                    <Icon icon="iconamoon:arrow-right-2-light" style={{ fontSize: '24px' }} />
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventGuestTable;
