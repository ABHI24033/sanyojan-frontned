import React from 'react';
import { Icon } from '@iconify/react';

const GuestListTable = ({ guestList, loading, onSendThankYou, pagination, onPageChange }) => {

    console.log("guestList----->", guestList);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'accepted': return 'bg-success-focus text-success-main';
            case 'rejected': return 'bg-danger-focus text-danger-main';
            case 'maybe': return 'bg-warning-focus text-warning-main';
            default: return 'bg-secondary-focus text-secondary-main'; // pending
        }
    };

    // Calculate showing range
    const currentPage = pagination?.currentPage || 1;
    const limit = pagination?.limit || 10;
    const totalGuests = pagination?.totalGuests || 0;
    const totalPages = pagination?.totalPages || 1;

    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalGuests);

    return (
        <div className='col-lg-12'>
            <div className='card'>
                <div className='card-body'>
                    <div className='table-responsive'>
                        <table className='table bordered-table mb-0'>
                            <thead>
                                <tr>
                                    <th scope='col'>Guest</th>
                                    <th scope='col'>Contact</th>
                                    <th scope='col'>Attendees</th>
                                    <th scope='col'>Food</th>
                                    <th scope='col' className='text-center'>Status</th>
                                    <th scope='col' className='text-end'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : guestList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center">
                                                <Icon icon="solar:users-group-rounded-linear" className="fs-48 text-muted mb-2" />
                                                <p className="text-muted mb-0">No guests found for this event.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    guestList.map((guest, index) => (
                                        <tr key={guest._id || index}>
                                            <td>
                                                <div className='d-flex align-items-center'>
                                                    {guest.avatar ? (
                                                        <img
                                                            src={guest.avatar}
                                                            alt={guest.name}
                                                            className='flex-shrink-0 me-12 radius-8'
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div className="flex-shrink-0 me-12 radius-8 bg-info-focus text-info-main d-flex justify-content-center align-items-center fw-bold text-uppercase" style={{ width: '40px', height: '40px' }}>
                                                            {guest.name?.charAt(0) || 'G'}
                                                        </div>
                                                    )}
                                                    <div className="flex-grow-1">
                                                        <h6 className='text-md text-primary-light fw-semibold mb-0'>
                                                            {guest.name}
                                                        </h6>
                                                        <span className='text-sm text-secondary-light'>
                                                            {guest.type === 'internal' ? 'Family Member' : `External (${guest.relation || 'Guest'})`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    {guest.email && <span className="text-sm text-secondary-light mb-1 d-flex align-items-center gap-1"><Icon icon="mdi:email-outline" /> {guest.email}</span>}
                                                    {guest.phone && <span className="text-sm text-secondary-light d-flex align-items-center gap-1"><Icon icon="mdi:phone-outline" /> {guest.phone}</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-md text-secondary-light fw-medium">{guest.totalAttendees}</span>
                                            </td>
                                            <td>
                                                <span className={`px-24 py-4 rounded-pill fw-medium text-sm ${guest.foodPreference === 'veg' ? 'bg-success-focus text-success-main' : guest.foodPreference === 'non-veg' ? 'bg-danger-focus text-danger-main' : guest.foodPreference === 'both' ? 'bg-info-focus text-info-main' : 'bg-neutral-200 text-neutral-600'}`}>
                                                    {guest.foodPreference === 'both' ? 'Veg/Non-Veg' : guest.foodPreference === 'veg' ? 'Veg' : guest.foodPreference === 'non-veg' ? 'Non-Veg' : 'N/A'}
                                                </span>
                                            </td>
                                            <td className='text-center'>
                                                <span className={`${getStatusBadgeClass(guest.currentStatus)} px-24 py-4 rounded-pill fw-medium text-sm text-capitalize`}>
                                                    {guest.currentStatus}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                {guest.currentStatus === 'accepted' && (
                                                    <button
                                                        onClick={() => onSendThankYou && onSendThankYou(guest)}
                                                        className="btn btn-sm btn-primary-50 text-primary-600 hover-bg-primary-100 d-inline-flex align-items-center gap-1"
                                                        title="Send Thank You"
                                                    >
                                                        <Icon icon="mdi:heart-outline" />
                                                        <span>Thank You</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {pagination && totalGuests > 0 && (
                        <div className="d-flex align-items-center justify-content-between mt-4 flex-wrap gap-3">
                            <div className="text-secondary-light text-sm">
                                Showing {startEntry} to {endEntry} of {totalGuests} entries
                            </div>
                            <ul className="pagination d-flex align-items-center mb-0 gap-1">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link w-32-px h-32-px d-flex justify-content-center align-items-center rounded-circle bg-neutral-200 text-secondary-light hover-bg-primary-600 hover-text-white border-0 p-0"
                                        onClick={() => onPageChange && onPageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <Icon icon="iconamoon:arrow-left-2-light" style={{ fontSize: '24px' }} />
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item`}>
                                        <button
                                            className={`page-link w-32-px h-32-px d-flex justify-content-center align-items-center rounded-circle border-0 ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-secondary-light hover-bg-primary-600 hover-text-white'}`}
                                            onClick={() => onPageChange && onPageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link w-32-px h-32-px d-flex justify-content-center align-items-center rounded-circle bg-neutral-200 text-secondary-light hover-bg-primary-600 hover-text-white border-0 p-0"
                                        onClick={() => onPageChange && onPageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <Icon icon="iconamoon:arrow-right-2-light" style={{ fontSize: '24px' }} />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuestListTable;
