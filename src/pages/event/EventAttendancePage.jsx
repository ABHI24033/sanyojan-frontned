import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPublicEventById, markEventAttendance } from "../../api/event";
import { Logo } from "../../components/header/Logo";
import AlertBox from "../../components/ui/Alert";

const EventAttendancePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });

    // Fetch Event Details (Public)
    const { data: event, isLoading, error } = useQuery({
        queryKey: ["public-event-attendance", id],
        queryFn: () => getPublicEventById(id),
        retry: false
    });

    // Attendance Mutation
    const { mutate: submitAttendance, isPending } = useMutation({
        mutationFn: (data) => markEventAttendance(id, data),
        onSuccess: () => {
            setIsSubmitted(true);
        },
        onError: (err) => {
            setAlert({
                type: "danger",
                message: err.response?.data?.message || "Failed to record attendance. Please try again."
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !mobile) {
            setAlert({ type: "warning", message: "Please fill all fields" });
            return;
        }
        submitAttendance({ name, mobile });
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="container min-vh-100 d-flex align-items-center justify-content-center">
                <div className="premium-card animate-fade-up p-5 text-center border-0 shadow-lg" style={{ maxWidth: '450px' }}>
                    <div className="mb-4 text-danger">
                        <Icon icon="lucide:alert-triangle" width={64} />
                    </div>
                    <h3 className="fw-bold mb-3">Event Not Found</h3>
                    <p className="text-secondary mb-4">This attendance link may be invalid or the event has been private.</p>
                    <button className="btn-premium w-100" onClick={() => navigate("/")}>Go to Home</button>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-2 p-md-4 py-3 bg-premium">
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate-fade-up w-100" style={{ maxWidth: "500px" }}>
                    <div className="card-body p-4 p-md-5 text-center">
                        <div className="mb-3">
                            <div className="d-inline-flex p-3 p-md-4 rounded-circle bg-success-focus text-success-main shadow-sm mb-3">
                                <Icon icon="mdi:check-decagram" width={48} className="animate-bounce-in" />
                            </div>
                            <h2 className="fw-bold text-premium fs-3 fs-md-2">Welcome!</h2>
                            <p className="text-secondary small px-2">Your attendance has been marked successfully. Enjoy the event!</p>
                        </div>

                        <div className="py-3 border-top border-bottom mb-4 bg-light bg-opacity-50 rounded-3">
                            <p className="text-uppercase text-muted fw-bold smaller mb-1 tracking-widest">Marked At</p>
                            <h5 className="fw-bold mb-0 text-primary-main">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h5>
                        </div>

                        <p className="small text-muted mb-0">You may now close this window or show this screen at the entry if requested.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-premium p-3">
            <div className="w-100" style={{ maxWidth: "480px" }}>
                <div className="premium-card p-5 animate-fade-up overflow-hidden border-0 shadow-sm bg-white rounded-4">
                    <div className="card-body p-4 p-md-5">
                        {/* Logo and Header */}
                        <div className="text-center mb-4">
                            <div className="mb-4 d-flex justify-content-center">
                                <Logo />
                            </div>
                            <div className="d-inline-flex p-3 rounded-circle bg-primary-focus text-primary-main shadow-sm mb-3">
                                <Icon icon="mdi:account-badge-horizontal-outline" width={40} />
                            </div>
                            <p className="text-uppercase tracking-widest smaller fw-bold mb-1 opacity-75">Event Arrival</p>
                            <h2 className="fw-bold text-premium fs-4 fs-md-3 mb-1">{event.eventName}</h2>
                            <p className="text-muted small">Please provide your details to mark your attendance</p>
                        </div>

                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-12">
                                <label className="form-label small fw-bold text-muted">Full Name</label>
                                <div className="position-relative">
                                    <Icon icon="mdi:account" className="position-absolute mt-3 ms-3 text-muted" width={20} />
                                    <input
                                        type="text"
                                        className="form-control form-input-premium ps-5"
                                        placeholder="Enter your name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label small fw-bold text-muted">Mobile Number</label>
                                <div className="position-relative">
                                    <Icon icon="mdi:phone" className="position-absolute mt-3 ms-3 text-muted" width={20} />
                                    <input
                                        type="tel"
                                        className="form-control form-input-premium ps-5"
                                        placeholder="Enter mobile number"
                                        required
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-12 pt-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-2 rounded-3"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <><span className="spinner-border spinner-border-sm"></span> Marking...</>
                                    ) : (
                                        <><Icon icon="mdi:check-circle" width={20} /> Mark Attendance</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <p className="text-center text-muted smaller mt-4 animate-fade-up opacity-50">
                    &copy; {new Date().getFullYear()} Sanyojan.
                </p>
            </div>

            <AlertBox alert={alert} setAlert={setAlert} />
            <style dangerouslySetInnerHTML={{
                __html: `
                .tracking-widest { letter-spacing: 0.2em; }
                .bg-primary-focus { background-color: rgba(13, 110, 253, 0.1); }
                .text-primary-main { color: #0d6efd; }
                .form-input-premium {
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                }
                .form-input-premium:focus {
                    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
                    border-color: #0d6efd;
                }
            ` }} />
        </div>
    );

};

export default EventAttendancePage;
