import React from "react";
import { Icon } from "@iconify/react";

const EventReportStats = ({ stats }) => {
    return (
        <div className="row gy-4 mb-24">
            <div className="col-xxl-3 col-sm-6">
                <div className="card px-24 py-20 rounded-12 border-0 shadow-none bg-primary-50">
                    <div className="card-body p-0">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Guests</p>
                                <h4 className="fw-bold mb-0">{stats?.totalGuests || 0}</h4>
                            </div>
                            <div className="w-48-px h-48-px d-flex justify-content-center align-items-center rounded-circle bg-primary-600 text-white">
                                <Icon icon="solar:users-group-rounded-bold" width="24" height="24" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xxl-3 col-sm-6">
                <div className="card px-24 py-20 rounded-12 border-0 shadow-none bg-success-50">
                    <div className="card-body p-0">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="fw-medium text-success-main mb-1">Total Attendees</p>
                                <h4 className="fw-bold mb-0">{stats?.totalAttendees || 0}</h4>
                            </div>
                            <div className="w-48-px h-48-px d-flex justify-content-center align-items-center rounded-circle bg-success-600 text-white">
                                <Icon icon="solar:check-circle-bold" width="24" height="24" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xxl-3 col-sm-6">
                <div className="card px-24 py-20 rounded-12 border-0 shadow-none bg-info-50">
                    <div className="card-body p-0">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="fw-medium text-info-main mb-1">Veg Guests</p>
                                <h4 className="fw-bold mb-0">{stats?.vegAttendees || 0}</h4>
                            </div>
                            <div className="w-48-px h-48-px d-flex justify-content-center align-items-center rounded-circle bg-info-600 text-white">
                                <Icon icon="mdi:leaf" width="24" height="24" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xxl-3 col-sm-6">
                <div className="card px-24 py-20 rounded-12 border-0 shadow-none bg-danger-50">
                    <div className="card-body p-0">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="fw-medium text-danger-main mb-1">Non-Veg Guests</p>
                                <h4 className="fw-bold mb-0">{stats?.nonVegAttendees || 0}</h4>
                            </div>
                            <div className="w-48-px h-48-px d-flex justify-content-center align-items-center rounded-circle bg-danger-600 text-white">
                                <Icon icon="mdi:food-drumstick" width="24" height="24" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventReportStats;
