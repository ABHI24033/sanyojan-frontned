import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AlertBox from "../ui/Alert";
import { respondToEventPublic } from "../../api/event";

const GuestRSVPModal = ({ show, onClose, event, onRSVPSuccess }) => {
    const [guestName, setGuestName] = useState("");
    const [guestMobile, setGuestMobile] = useState("");
    const [guestAlert, setGuestAlert] = useState({ type: "", message: "" });
    const [guestResponded, setGuestResponded] = useState(false);

    // Guest RSVP Mutation
    const guestRsvpMutation = useMutation({
        mutationFn: (status) => respondToEventPublic(event._id, { name: guestName, mobile: guestMobile, status }),
        onSuccess: (data) => {
            setGuestAlert({ type: "success", message: data.message });
            setGuestResponded(true);
            if (onRSVPSuccess) onRSVPSuccess();
            setTimeout(() => onClose(), 2000); // Close modal after success
        },
        onError: (err) => {
            setGuestAlert({ type: "danger", message: err.response?.data?.message || "Something went wrong" });
        },
    });

    const handleGuestRSVP = (status) => {
        if (!guestName.trim() || !guestMobile.trim()) {
            setGuestAlert({ type: "warning", message: "Please enter Name and Mobile" });
            return;
        }
        if (guestMobile.length < 10) {
            setGuestAlert({ type: "warning", message: "Invalid mobile number" });
            return;
        }
        guestRsvpMutation.mutate(status);
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-10 rounded-4 shadow-lg border-0">
                    <div className="modal-header border-bottom-0 pb-0">
                        <h5 className="modal-title fw-bold">{event?.eventName}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-10">
                        <AlertBox alert={guestAlert} setAlert={setGuestAlert} />
                        <p className="text-muted small mb-4">Please enter your details to let the host know you're coming.</p>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Your Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="John Doe"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold small">Mobile Number <span className="text-danger">*</span></label>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="(555) 123-4567"
                                value={guestMobile}
                                onChange={(e) => setGuestMobile(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>

                        <div className="d-grid gap-10">
                            <button className="btn btn-success fw-bold" onClick={() => handleGuestRSVP("accepted")} disabled={guestRsvpMutation.isPending}>Yes, I'm Going</button>
                            <button className="btn btn-warning text-white fw-bold" onClick={() => handleGuestRSVP("maybe")} disabled={guestRsvpMutation.isPending}>Maybe</button>
                            <button className="btn btn-outline-danger fw-bold" onClick={() => handleGuestRSVP("rejected")} disabled={guestRsvpMutation.isPending}>No, I can't make it</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestRSVPModal;
