import React from "react";
import { Modal } from "react-bootstrap";
import EventRSVPForm from "../../components/event/EventRSVPForm";

const RSVPModal = ({ show, onHide, event, isInvited, isHost, myGuestEntry, onRSVPSuccess }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">Confirm Your Presence</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2 pb-4 px-4">
                <p className="text-muted small mb-4">
                    Please let us know if you'll be joining us for <strong>{event?.eventName}</strong>.
                </p>

                {onRSVPSuccess && (
                    <EventRSVPForm
                        isAuthenticated={true}
                        userStatus={myGuestEntry?.status}
                        userFoodPreference={myGuestEntry?.foodPreference}
                        userTotalAttendees={myGuestEntry?.totalAttendees}
                        onSubmit={(data) => {
                            onRSVPSuccess(data);
                            onHide();
                        }}
                    />
                )}
            </Modal.Body>
        </Modal>
    );
};

export default RSVPModal;
