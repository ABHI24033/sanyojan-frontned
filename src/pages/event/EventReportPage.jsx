import React from "react";
import { Icon } from "@iconify/react";
import MasterLayout from "../../masterLayout/MasterLayout";
import { useEventReport } from "../../hooks/event/useEventReport";
import EventReportStats from "../../components/event/EventReportStats";
import EventGuestTable from "../../components/event/EventGuestTable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axiosInstance from "../../api/axiosInstance";
import { useState } from "react";

import { getEventAttendance } from "../../api/event";
import EventAttendanceTable from "../../components/event/EventAttendanceTable";
import { useQuery } from "@tanstack/react-query";
import MemberFilterModal from "../../components/reports/MemberFilterModal";

const EventReportPage = () => {
    const {
        navigate,
        authLoading,
        event,
        eventLoading,
        guests,
        guestsLoading,
        stats,
        page,
        setPage,
        filterStatus,
        setFilterStatus,
        filterCity,
        setFilterCity,
        cities,
        searchQuery,
        setSearchQuery,
        memberFilters,
        setMemberFilters,
        pagination,
        totalGuestsCount,
        startEntry,
        endEntry,
        totalPages
    } = useEventReport();

    const { id } = useEventReport();
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [activeTab, setActiveTab] = useState("rsvp"); // [NEW] Toggle between rsvp and attendance

    // [NEW] Fetch attendance data
    const { data: attendance, isLoading: attendanceLoading } = useQuery({
        queryKey: ["event-attendance", id],
        queryFn: () => getEventAttendance(id),
        enabled: activeTab === "attendance"
    });

    const handleApplyFilters = (filters) => {
        setMemberFilters(filters);
    };

    const handleResetFilters = () => {
        setMemberFilters({});
    };

    const activeFilterCount = Object.values(memberFilters).filter(v =>
        (Array.isArray(v) && v.length > 0) || (typeof v === 'string' && v.trim() !== '') || (v !== null && typeof v === 'object' && Object.keys(v).length > 0)
    ).length;

    const handleDownloadExcel = async () => {
        try {
            setDownloadLoading(true);
            const res = await axiosInstance.get(`/events/${id}/guests`, {
                params: {
                    limit: 10000,
                    status: filterStatus,
                    city: filterCity,
                    search: searchQuery,
                    ...memberFilters
                }
            });
            const guestsData = res.data.data;
            // ... (rest of handleDownloadExcel remains same)
            // ...
            // ...
            saveAs(blob, `Event_Report_${event.eventName}.xlsx`);

        } catch (error) {
            console.error("Error downloading excel:", error);
        } finally {
            setDownloadLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            setDownloadLoading(true);
            const res = await axiosInstance.get(`/events/${id}/guests`, {
                params: {
                    limit: 10000,
                    status: filterStatus,
                    city: filterCity,
                    search: searchQuery,
                    ...memberFilters
                }
            });
            const guestsData = res.data.data;
            // ... (rest of handleDownloadPDF remains same)
            // ...
            // ...
            doc.save(`Event_Report_${event.eventName}.pdf`);
        } catch (error) {
            console.error("Error downloading PDF:", error);
        } finally {
            setDownloadLoading(false);
        }
    };

    if (authLoading || eventLoading) {
        return (
            <MasterLayout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
            </MasterLayout>
        );
    }

    if (!event) {
        return (
            <MasterLayout>
                <div className="text-center py-5 text-danger">Error loading report</div>
            </MasterLayout>
        );
    }

    return (
        <MasterLayout>
            <div className="container py-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="btn btn-link d-flex align-items-center text-decoration-none ps-0 text-muted fw-medium inner-shadow-sm"
                            onClick={() => navigate(-1)}
                        >
                            <Icon icon="mdi:arrow-left" width="28" height="28" />
                        </button>
                        <div>
                            <h4 className="mb-0 text-primary-600 fw-bold ms-2">Event Report: {event.eventName}</h4>
                            <p className="text-secondary-light text-sm ms-2 mb-0">{new Date(event.startDate).toDateString()}</p>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-primary d-flex align-items-center gap-2 radius-8"
                            onClick={() => setShowFilterModal(true)}
                        >
                            <Icon icon="solar:filter-bold-duotone" width={20} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="badge bg-white text-primary rounded-circle ms-1 p-1" style={{ fontSize: '10px', minWidth: '18px' }}>
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <button
                            className="btn btn-outline-success d-flex align-items-center gap-2"
                            onClick={handleDownloadExcel}
                            disabled={downloadLoading}
                        >
                            <Icon icon="mdi:microsoft-excel" width="20" height="20" />
                            {downloadLoading ? '...' : 'Excel'}
                        </button>
                        <button
                            className="btn btn-outline-danger d-flex align-items-center gap-2"
                            onClick={handleDownloadPDF}
                            disabled={downloadLoading}
                        >
                            <Icon icon="mdi:file-pdf-box" width="20" height="20" />
                            {downloadLoading ? '...' : 'PDF'}
                        </button>
                    </div>
                </div>

                <MemberFilterModal
                    show={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    onApply={handleApplyFilters}
                    onReset={handleResetFilters}
                    initialFilters={memberFilters}
                />

                {/* Summary Cards */}
                <EventReportStats stats={stats} />

                <EventGuestTable
                    guests={guests}
                    guestsLoading={guestsLoading}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    filterCity={filterCity}
                    setFilterCity={setFilterCity}
                    cities={cities}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setPage={setPage}
                    pagination={pagination}
                    totalGuestsCount={totalGuestsCount}
                    startEntry={startEntry}
                    endEntry={endEntry}
                    page={page}
                    totalPages={totalPages}
                />
            </div>
        </MasterLayout>
    );
};

export default EventReportPage;
