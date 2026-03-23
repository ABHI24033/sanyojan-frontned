import React from "react";
import EventCard from "./EventCard";
import { Icon } from "@iconify/react";

export default function EventList({ events, isLoading, hasNextPage, isFetchingNextPage, onLoadMore }) {
    if (isLoading && events.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-3">Loading events...</p>
            </div>
        );
    }

    if (!isLoading && events.length === 0) {
        return (
            <div className="text-center py-5">
                <Icon icon="mdi:calendar-blank-outline" width={80} className="text-muted opacity-50 mb-3" />
                <h5 className="text-muted">No events found</h5>
                <p className="text-muted small">Check back later for upcoming events</p>
            </div>
        );
    }

    return (
        <>
            {/* Event Grid */}
            <div className="row g-4">
                {events.map((event) => (
                    <div key={event._id} className="col-12 col-md-6 col-lg-4">
                        <EventCard event={event} />
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
                <div className="text-center mt-5">
                    <button
                        className="btn btn-outline-primary px-5 py-2 d-inline-flex align-items-center"
                        onClick={onLoadMore}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Loading...
                            </>
                        ) : (
                            <>
                                Load More Events
                                <Icon icon="mdi:chevron-down" className="ms-2" width={20} />
                            </>
                        )}
                    </button>
                </div>
            )}
        </>
    );
}
