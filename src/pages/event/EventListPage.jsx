import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import EventList from "../../components/event/EventList";
import { useEventList } from "../../hooks/event/useEventList";
import MasterLayout from "../../masterLayout/MasterLayout";

export default function EventListPage() {
    const {
        events,
        error,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        refetch,
    } = useEventList({ limit: 9 });

    return (
        <MasterLayout>
            <div className="container py-4 py-md-5">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                            <div>
                                <h2 className="fw-bold mb-1 fs-3 d-flex align-items-center">
                                    <Icon icon="mdi:calendar-multiple" width={32} className="text-primary me-3" />
                                    All Events
                                </h2>
                                <p className="text-muted mb-0">
                                    Browse and discover upcoming family events
                                </p>
                            </div>
                            <Link
                                to="/create-event"
                                className="btn btn-primary px-5 py-10 d-flex align-items-center"
                            >
                                <Icon icon="mdi:plus" width={20} className="me-2" />
                                Create Event
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm radius-12 overflow-hidden bg-white">
                            <div className="card-body p-0">
                                <div className="d-flex flex-column flex-sm-row">
                                    <button
                                        className="flex-grow-1 py-3 px-4 fw-bold border-0 bg-white text-primary border-bottom border-3 border-primary shadow-sm"
                                    >
                                        <Icon icon="mdi:compass-outline" className="me-2" width={20} />
                                        Explore Events
                                    </button>
                                    <Link
                                        to="/received-invitations"
                                        className="flex-grow-1 py-3 px-4 fw-bold border-0 bg-transparent text-muted text-center text-decoration-none hover-bg-light transition-all"
                                    >
                                        <Icon icon="solar:letter-unread-bold-duotone" className="me-2" width={20} />
                                        My Invitations
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <Icon icon="mdi:alert-circle" width={24} className="me-2" />
                        <div>
                            <strong>Error:</strong> {error.message || "Failed to load events"}
                        </div>
                    </div>
                )}

                {/* Event List */}
                <div className="mt-40">
                    <EventList
                        events={events}
                        isLoading={isLoading}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        onLoadMore={() => fetchNextPage()}
                    />
                </div>
            </div>
        </MasterLayout>
    );
}
