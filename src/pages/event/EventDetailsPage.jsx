import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import MasterLayout from "../../masterLayout/MasterLayout";
import { Logo } from "../../components/header/Logo";
import AddExternalGuestForm from "../../components/event/AddExternalGuestForm";
import EventRSVPForm from "../../components/event/EventRSVPForm";
import { useEventDetails } from "../../hooks/event/useEventDetails";
import AlertBox from "../../components/ui/Alert";

// --- RENDER HELPERS ---

const LoadingView = () => (
    <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
);

const ErrorView = ({ isAuthenticated, navigate }) => (
    <div className="text-center py-5">
        <h4 className="text-danger">Event not found or access denied</h4>
        <div className="mt-3">
            {isAuthenticated ? (
                <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>Go Back</button>
            ) : (
                <a href="/sign-in" className="btn btn-primary">Sign In</a>
            )}
        </div>
    </div>
);

// Layout Wrapper
const Layout = ({ children, isAuthenticated }) => {
    return isAuthenticated ? (
        <MasterLayout>{children}</MasterLayout>
    ) : (
        <div className="bg-light min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
                <div className="container py-4">
                    <Logo />
                </div>
            </nav>
            {children}
        </div>
    );
};

const EventDetailsPage = () => {
    const {
        event, isLoading, isGuestLoading, error, isAuthenticated,
        isInvited, myGuestEntry, isHost,
        copied, showAddExternalGuest, setShowAddExternalGuest,
        handleShare, handleRSVPSubmit, formatDate, navigate, alert, setAlert,
        isConfirmInvitation, isRSVPLoading
    } = useEventDetails();


    if (isLoading || isGuestLoading) return <Layout isAuthenticated={isAuthenticated}><LoadingView /></Layout>; // [UPDATED] Wait for guest status
    if (error || !event) return <Layout isAuthenticated={isAuthenticated}><ErrorView isAuthenticated={isAuthenticated} navigate={navigate} /></Layout>;

    return (
        <Layout isAuthenticated={isAuthenticated}>
            <div className="container py-4 py-md-5">
                {/* Top Bar */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    {isAuthenticated ? (
                        <button className="btn btn-link d-flex align-items-center text-decoration-none ps-0 text-muted fw-medium inner-shadow-sm" onClick={() => navigate(-1)}>
                            <Icon icon="mdi:arrow-left" className="me-2" width="28" height="28" /> Back
                        </button>
                    ) : <div></div>}

                    <div className="d-flex gap-2">
                        {isAuthenticated && (
                            <button
                                className={`btn ${copied ? 'btn-success' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
                                onClick={handleShare}
                            >
                                <Icon icon={copied ? "mdi:check" : "mdi:share-variant"} />
                                {copied ? "Link Copied" : "Share"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="card border-0 rounded-4 mb-5 bg-transparent">
                    {/* Cover Image */}
                    <div className="position-relative" style={{ height: "300px", mdHeight: "400px" }}>
                        {event?.coverImage ? (
                            <img src={event.coverImage} alt={event.eventName} className="w-100 h-100 object-fit-cover rounded-4 shadow-sm" />
                        ) : (
                            <div className="w-100 h-100 bg-secondary-subtle d-flex align-items-center justify-content-center rounded-4">
                                <Icon icon="mdi:calendar-star" width={80} className="text-secondary opacity-25" />
                            </div>
                        )}
                        <div
                            className="position-absolute bottom-0 start-0 rounded-4 w-100 h-100 px-3 px-lg-5 py-3 py-lg-4"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.30)",
                            }}
                        >
                            <div className="position-absolute bottom-0 py-5">
                                <h1
                                    className="text-white fw-bold mb-2 text-shadow"
                                    style={{
                                        fontSize: "clamp(1.6rem, 4vw, 3rem)",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {event.eventName}
                                </h1>
                                <div className="d-flex align-items-center text-white">
                                    <Icon icon="mdi:calendar" className="me-2 fs-5" />
                                    <span className="fs-6 fs-md-5">
                                        {formatDate(event.startDate)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mt-2">
                        {/* Details Column */}
                        <div className="col-lg-8">
                            <div className="bg-white p-5 rounded-4 border shadow-sm h-100">
                                <h5 className="fw-bold mb-20 border-bottom pb-2">Event Details</h5>

                                {/* Info Grid */}
                                <div className="row g-4 mb-4">
                                    {/* Time */}
                                    <div className="col-md-6 d-flex">
                                        <div className="me-3">
                                            <div className="bg-primary-subtle rounded-circle p-10 d-flex align-items-center justify-content-center" style={{ height: "50px", width: "50px" }}>
                                                <Icon icon="mdi:clock-time-four-outline" width={24} className="text-primary" />
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Time</h6>
                                            <p className="text-muted mb-0 fs-6">
                                                {event.startTime} - {event.endTime}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="col-md-6 d-flex">
                                        <div className="me-3">
                                            <div className="bg-primary-subtle rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ height: "50px", width: "50px" }}>
                                                <Icon icon="mdi:map-marker" width={24} className="text-primary" />
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Location</h6>

                                            {event.eventType === "virtual" ? (
                                                <>
                                                    <p className="text-muted mb-0 fs-6">Virtual Event</p>
                                                    {event.virtualLink && (
                                                        <a
                                                            href={event.virtualLink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="small btn btn-primary d-block mt-1"
                                                        >
                                                            Join Meeting
                                                        </a>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-muted mb-1 fs-6">{event.location}</p>
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="small btn btn-primary d-flex align-items-center"
                                                    >
                                                        <Icon icon="mdi:google-maps" className="me-1" />
                                                        Open in Google Maps
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h6 className="fw-bold mb-2">Description</h6>
                                    <p
                                        className="text-secondary lh-lg fs-6"
                                        style={{ whiteSpace: "pre-line" }}
                                    >
                                        {event.eventDetails || "No details provided."}
                                    </p>
                                </div>
                                {/* Embedded Google Map */}
                                {event.eventType === "inperson" && event.location && (
                                    <div className="mb-4 rounded-3 overflow-hidden border">
                                        <iframe
                                            title="Event Location Map"
                                            src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                                            width="100%"
                                            height="250"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                            </div>

                        </div>


                        {/* Sidebar Column */}
                        <div className="col-lg-4">
                            {/* Actions/RSVP Card */}
                            <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white">
                                <div className="card-body p-5">
                                    {/* QR Codes - Only for Host */}
                                    {isHost && (
                                        <div className=" mb-4 bg-white">
                                            <div className=" p-4">
                                                <h6 className="fw-bold fs-6 mb-3 d-flex align-items-center">
                                                    <Icon icon="mdi:qrcode" className="me-2" /> Event QR Codes
                                                </h6>
                                                <div className="d-flex w-100 justify-content-between">
                                                    {/* RSVP QR */}
                                                    <div className="mb-4 text-center">
                                                        <div className="bg-light rounded-3 p-3 mb-2">
                                                            <QRCodeCanvas
                                                                id="event-rsvp-qr"
                                                                value={`${window.location.origin}/events/${event._id}`}
                                                                size={60}
                                                                level="M"
                                                            />
                                                        </div>
                                                        <p className="small text-muted mb-2">Event Link QR</p>
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => {
                                                                const canvas = document.getElementById("event-rsvp-qr");
                                                                if (canvas) {
                                                                    const url = canvas.toDataURL("image/png");
                                                                    const link = document.createElement("a");
                                                                    link.href = url;
                                                                    link.download = `event-${event.eventName}-qr.png`;
                                                                    link.click();
                                                                }
                                                            }}
                                                        >
                                                            <Icon icon="mdi:download" className="me-0 fs-5" />
                                                        </button>
                                                    </div>
                                                    {/* Attendance QR */}
                                                    <div className="text-center">
                                                        <div className="bg-light rounded-3 p-3 mb-2">
                                                            <QRCodeCanvas
                                                                id="event-attendance-qr"
                                                                value={`${window.location.origin}/events/${event._id}/attendance`}
                                                                size={60}
                                                                level="M"
                                                            />
                                                        </div>
                                                        <p className="small text-muted mb-2">Attendance QR</p>
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => {
                                                                const canvas = document.getElementById("event-attendance-qr");
                                                                if (canvas) {
                                                                    const url = canvas.toDataURL("image/png");
                                                                    const link = document.createElement("a");
                                                                    link.href = url;
                                                                    link.download = `event-${event.eventName}-attendance-qr.png`;
                                                                    link.click();
                                                                }
                                                            }}
                                                        >
                                                            <Icon icon="mdi:download" className="me-0 fs-5" /> 
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )}

                                    <h5 className="fw-bold fs-6 mt-20">
                                        {isHost ? "Event Management" : "Invitation Acceptance"}
                                    </h5>
                                    {isHost ? (
                                        // HOST VIEW: Show Report Button instead of Form
                                        <div className="text-center">
                                            <div className="p-3 bg-light rounded-3 mb-3">
                                                <p className="small text-muted mb-0">
                                                    Hosts can view the complete guest list and detailed report data.
                                                </p>
                                            </div>
                                            <Link to={`/reports/event/${event?._id}`} className="btn btn-primary w-100 fw-bold py-10 shadow-sm rounded-pill">
                                                <Icon icon="mdi:chart-bar" className="me-2" /> View Guest Report
                                            </Link>
                                        </div>
                                    ) : (
                                        // GUEST VIEW: Show RSVP Form
                                        <div className="mt-2">
                                            {
                                                isConfirmInvitation ? (
                                                    <div className="d-flex align-items-center justify-content-center w-100 h-100 py-5" style={{ minHeight: "300px" }}>
                                                        <div className="text-center d-flex flex-column h-100 align-items-center justify-content-center w-100 animation-fade-in" style={{ borderRadius: "10px", height: "300px" }}>
                                                            {/* Tick Circle */}
                                                            <div
                                                                className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-success shadow-sm"
                                                                style={{ width: "80px", height: "80px" }}
                                                            >
                                                                <Icon
                                                                    icon="mdi:check-bold"
                                                                    className="text-white"
                                                                    style={{ fontSize: "40px" }}
                                                                />
                                                            </div>

                                                            {/* Message */}
                                                            <h4 className="fw-bold fs-5 text-success mb-2">
                                                                Thank you for visiting {event.eventName}!
                                                            </h4>
                                                            {/* <p className="text-muted small">Your RSVP has been successfully recorded.</p> */}
                                                        </div>
                                                    </div>

                                                ) : (
                                                    // <div className="d-flex align-items-center justify-content-center w-100 h-100 py-5" style={{ minHeight: "300px" }}>
                                                    //     <EventRSVPForm
                                                    //         isAuthenticated={isAuthenticated}
                                                    //         userStatus={myGuestEntry?.status}
                                                    //         userFoodPreference={myGuestEntry?.foodPreference}
                                                    //         userTotalAttendees={myGuestEntry?.totalAttendees}
                                                    //         userVegAttendees={myGuestEntry?.vegAttendees}
                                                    //         userNonVegAttendees={myGuestEntry?.nonVegAttendees}
                                                    //         userCity={myGuestEntry?.city}
                                                    //         isExternal={!isAuthenticated}
                                                    //         onSubmit={handleRSVPSubmit}
                                                    //         isLoading={isRSVPLoading}
                                                    //     />
                                                    // </div>
                                                    <div className="w-100 py-3">
                                                        <EventRSVPForm
                                                            isAuthenticated={isAuthenticated}
                                                            userStatus={myGuestEntry?.status}
                                                            userFoodPreference={myGuestEntry?.foodPreference}
                                                            userTotalAttendees={myGuestEntry?.totalAttendees}
                                                            userVegAttendees={myGuestEntry?.vegAttendees}
                                                            userNonVegAttendees={myGuestEntry?.nonVegAttendees}
                                                            userCity={myGuestEntry?.city}
                                                            isExternal={!isAuthenticated}
                                                            onSubmit={handleRSVPSubmit}
                                                            isLoading={isRSVPLoading}
                                                        />
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Host Info */}
                            <div className="card border rounded-4 mb-4">
                                <div className="card-body p-3 d-flex align-items-center">
                                    {event.createdBy?.profilePicture ? (
                                        <img src={event.createdBy.profilePicture} alt="Host" className="rounded-circle me-3 border" width={50} height={50} />
                                    ) : (
                                        <div
                                            className="rounded-circle me-3 border bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                            style={{ width: "50px", height: "50px", fontSize: "1.2rem" }}
                                        >
                                            {(event.createdBy?.firstname?.charAt(0) || "") + (event.createdBy?.lastname?.charAt(0) || "")}
                                        </div>
                                    )}
                                    <div>
                                        <h6 className="mb-0 fs-6 fw-bold">{event.createdBy?.firstname} {event.createdBy?.lastname}</h6>
                                        <small className="text-muted">Organizer</small>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <AlertBox alert={alert} setAlert={setAlert} />
        </Layout>
    );
};

export default EventDetailsPage;
