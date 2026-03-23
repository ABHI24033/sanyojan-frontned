import React from "react";
import { Icon } from "@iconify/react";

const EventAttendanceTable = ({ attendance, isLoading }) => {
    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24">
                <h6 className="text-lg fw-semibold mb-0">Venue Attendance List ({attendance?.length || 0})</h6>
                <p className="text-sm text-secondary-light mb-0">People who scanned the QR code at the event location</p>
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">Guest Name</th>
                                <th scope="col">Mobile</th>
                                <th scope="col">Arrival Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </td>
                                </tr>
                            ) : attendance?.length > 0 ? (
                                attendance.map((record, i) => (
                                    <tr key={record._id || i}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 me-12 radius-8 bg-success-focus text-success-main d-flex justify-content-center align-items-center fw-bold text-uppercase" style={{ width: '40px', height: '40px' }}>
                                                    {record.name.charAt(0)}
                                                </div>
                                                <h6 className="text-md text-primary-light fw-semibold mb-0">{record.name}</h6>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-sm text-secondary-light">{record.mobile}</span>
                                        </td>
                                        <td className="text-sm text-secondary-light">
                                            {new Date(record.attendedAt || record.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center text-muted">
                                            <Icon icon="mdi:account-off-outline" className="fs-1 mb-2" />
                                            <p className="mb-0">No attendance records yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EventAttendanceTable;
