import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";

const EventRSVPForm = ({
    isAuthenticated,
    userStatus = "pending",
    userTotalAttendees = 1,
    userVegAttendees = 0,
    userNonVegAttendees = 0,
    userCity = "",
    onSubmit,
    isExternal = false,
    isLoading = false
}) => {
    // Initial View Mode: If user has already responded (not pending), show Summary. Else Form.
    const [viewMode, setViewMode] = useState(userStatus && userStatus !== "pending" ? "summary" : "form");

    // Form State
    const [status, setStatus] = useState(userStatus === "pending" ? "" : userStatus);
    const [total, setTotal] = useState(userTotalAttendees || 1);
    const [veg, setVeg] = useState(userVegAttendees || 0);
    const [nonVeg, setNonVeg] = useState(userNonVegAttendees || (userTotalAttendees - userVegAttendees) || 0);
    const [city, setCity] = useState(userCity || "");

    // Autocomplete State
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFetchingCities, setIsFetchingCities] = useState(false);

    // Guest fields for non-auth users
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");

    // Fetch Indian Cities
    useEffect(() => {
        const fetchCities = async () => {
            setIsFetchingCities(true);
            try {
                const response = await axios.post("https://countriesnow.space/api/v0.1/countries/cities", {
                    country: "India"
                });
                if (response.data && !response.data.error) {
                    setCities(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
            } finally {
                setIsFetchingCities(false);
            }
        };
        fetchCities();
    }, []);

    // Effect to filter cities
    useEffect(() => {
        if (city.trim().length > 1) {
            const filtered = cities.filter(c =>
                c.toLowerCase().startsWith(city.toLowerCase())
            ).slice(0, 10);
            setFilteredCities(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setFilteredCities([]);
            setShowSuggestions(false);
        }
    }, [city, cities]);

    // Effect to sync Veg/Non-Veg with Total
    useEffect(() => {
        // If total changes and current sum doesn't match, adjust Non-Veg as default
        if (veg + nonVeg !== total) {
            if (veg > total) {
                setVeg(total);
                setNonVeg(0);
            } else {
                setNonVeg(total - veg);
            }
        }
    }, [total]);

    // Update state if props change (e.g. re-fetch)
    useEffect(() => {
        if (userStatus && userStatus !== 'pending') {
            setStatus(userStatus);
            // If we receive a status update and we are in form mode (but not dirty? handling dirty state is complex, 
            // for now let's not force viewMode change unless it was pending)
            if (viewMode === 'form' && status === "") { // Only if form was empty/clean
                setViewMode("summary");
            }
        }
    }, [userStatus]);

    const handleVegChange = (val) => {
        const v = parseInt(val);
        setVeg(v);
        setNonVeg(total - v);
    };

    const handleNonVegChange = (val) => {
        const nv = parseInt(val);
        setNonVeg(nv);
        setVeg(total - nv);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isExternal) {
            if (!name.trim()) {
                alert("Please enter your name");
                return;
            }
            if (!mobile.trim()) {
                alert("Please enter your mobile number");
                return;
            }
        }

        if (status === "") {
            alert("Please select your attendance status");
            return;
        }

        if (status !== "rejected" && !city.trim()) {
            alert("Please provide your city");
            return;
        }

        const data = {
            status,
            totalAttendees: status === "rejected" ? 0 : total,
            vegAttendees: status === "rejected" ? 0 : veg,
            nonVegAttendees: status === "rejected" ? 0 : nonVeg,
            city: status === "rejected" ? "" : city,
            name,
            mobile
        };

        onSubmit(data);
    };

    // --- VIEW: SUMMARY (Already Responded) ---
    if (viewMode === "summary") {
        const isYes = status === "accepted";
        const isMaybe = status === "maybe";
        const isNo = status === "rejected";

        return (
            <div className={`premium-card animate-fade-up text-center border-0 shadow-lg p-5 ${isNo ? 'bg-danger-bg' : isMaybe ? 'bg-warning-bg' : 'bg-success-bg'}`}>
                {/* Icon */}
                <div className={`mb-4 d-inline-flex p-4 rounded-circle ${isNo ? 'bg-danger-focus text-danger-main' : isMaybe ? 'bg-warning-focus text-warning-main' : 'bg-success-focus text-success-main'}`}>
                    <Icon
                        icon={isNo ? "lucide:x-circle" : isMaybe ? "lucide:help-circle" : "lucide:check-circle-2"}
                        width={48}
                    />
                </div>

                {/* Title */}
                <p className="text-uppercase text-muted fw-bold small mb-2 tracking-widest" style={{ letterSpacing: "2px" }}>Response Received</p>
                <h3 className="fw-bold mb-3">
                    {isNo ? "We'll miss you!" : isMaybe ? "Hope to see you!" : "See you there!"}
                </h3>

                <div className="mb-4">
                    <span className={`px-4 py-2 rounded-pill fw-bold ${isNo ? 'bg-danger text-white' : isMaybe ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>

                {status !== "rejected" && city && (
                    <div className="mb-4 py-3 border-top border-bottom">
                        <div className="d-flex align-items-center justify-content-center gap-2 text-muted fw-semibold">
                            <Icon icon="lucide:map-pin" />
                            <span>Traveling from {city}</span>
                        </div>
                    </div>
                )}

                <p className="text-secondary mb-5 px-md-4">
                    {isNo
                        ? "We're sorry you won't be able to join us this time. We've updated the host with your response."
                        : "Your registration is confirmed. We've added you to the guest list and notified the host."}
                </p>

                <button
                    type="button"
                    className="btn btn-link text-primary fw-bold text-decoration-none transition-all hover-scale"
                    onClick={() => setViewMode("form")}
                >
                    <Icon icon="lucide:edit-3" className="me-2" />
                    Modify your response
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="">
            {/* Public Guest Fields */}
            {isExternal && (
                <div className="row gap-4">
                    <div className="col-md-12 text-start">
                        <label className="small d-flex align-items-center fw-bold text-secondary mb-2">
                            <Icon icon="lucide:user" className="me-1" /> Full Name
                        </label>
                        <input
                            type="text"
                            className="form-input-premium py-10 px-10 w-100"
                            placeholder="Name"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="col-md-12 text-start">
                        <label className="small d-flex align-items-center fw-bold text-secondary mb-2">
                            <Icon icon="lucide:phone" className="me-1" /> Mobile Number
                        </label>
                        <input
                            type="tel"
                            className="form-input-premium py-10 px-10 w-100"
                            placeholder="Mobile Number"
                            required
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Status Selection */}
            <div className="mt-10 text-center">
                <label className="text-uppercase tracking-wider small fw-bold text-muted d-block">Will you join us?</label>
                <div className="row g-2">
                    {[
                        { id: 'accepted', label: 'Attending', icon: 'mdi:check-circle', color: 'text-success', bg: 'bg-success-focus' },
                        { id: 'maybe', label: 'Maybe', icon: 'mdi:help-circle', color: 'text-warning', bg: 'bg-warning-focus' },
                        { id: 'rejected', label: 'Not Attending', icon: 'mdi:close-circle', color: 'text-danger', bg: 'bg-danger-focus' }
                    ].map((opt) => (
                        <div className="col-4" key={opt.id}>
                            <label className={`w-100 p-2 p-md-3 border rounded-3 text-center cursor-pointer transition-all ${status === opt.id ? `${opt.bg} border-primary` : 'bg-white'}`}>
                                <input type="radio" value={opt.id} checked={status === opt.id} onChange={(e) => setStatus(e.target.value)} className="d-none" />
                                <Icon icon={opt.icon} width={24} className={`${opt.color} mb-1`} />
                                <div className="smaller fw-bold">{opt.label}</div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {status !== 'rejected' && (
                <div className="text-start">
                    {/* City Field */}
                    <div className="mb-4 position-relative">
                        <label className="small fw-bold text-secondary mb-2 d-block">
                            <Icon icon="lucide:map-pin" className="me-1 text-primary" />
                            Traveling from
                        </label>
                        <input
                            type="text"
                            className="form-input-premium w-100"
                            placeholder="Enter your city..."
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            onFocus={() => { if (filteredCities.length > 0) setShowSuggestions(true); }}
                            autoComplete="off"
                        />
                        {showSuggestions && (
                            <div className="position-absolute w-100 shadow-lg border border-light mt-1 rounded-3 overflow-hidden bg-white" style={{ zIndex: 100, maxHeight: "200px", overflowY: "auto" }}>
                                {filteredCities.map((c, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className="btn btn-white w-100 text-start border-0 border-bottom p-2 small hover-bg-light"
                                        onClick={() => {
                                            setCity(c);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                        {isFetchingCities && city.length === 0 && (
                            <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                                <span className="spinner-border spinner-border-sm text-muted" role="status"></span>
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="small fw-bold text-dark mb-1 d-block">
                            <Icon icon="solar:users-group-two-rounded-linear" className="me-1 text-primary" />
                            Total Attendees
                        </label>
                        <select
                            className="form-select shadow-sm"
                            value={total}
                            onChange={(e) => setTotal(parseInt(e.target.value))}
                        >
                            {[...Array(20)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1} Person{i > 0 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div className="row g-2 mb-4">
                        <div className="col-6">
                            <label className="small fw-bold text-success mb-1 d-block">Vegetarian</label>
                            <select
                                className="form-select shadow-sm border-success-subtle"
                                value={veg}
                                onChange={(e) => handleVegChange(e.target.value)}
                            >
                                {[...Array(total + 1)].map((_, i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-6">
                            <label className="small fw-bold text-danger mb-1 d-block">Non-Vegetarian</label>
                            <select
                                className="form-select shadow-sm border-danger-subtle"
                                value={nonVeg}
                                onChange={(e) => handleNonVegChange(e.target.value)}
                            >
                                {[...Array(total + 1)].map((_, i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex mt-3">
                {userStatus && userStatus !== 'pending' && (
                    <button
                        type="button"
                        className="btn btn-light flex-grow-1 py-3 fw-bold rounded-3 shadow-sm border-0"
                        onClick={() => setViewMode("summary")}
                    >
                        Back
                    </button>
                )}

                <button
                    type="submit"
                    className="btn btn-primary flex-grow-1 py-3 shadow-md"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                    ) : (userStatus && userStatus !== 'pending' ? "Update My Response" : "Confirm Attendance")}
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-scale:hover { transform: scale(1.05); }
                .tracking-widest { letter-spacing: 0.1em; }
                .bg-success-bg { background-color: #f0fdf4; }
                .bg-warning-bg { background-color: #fffbeb; }
                .bg-danger-bg { background-color: #fef2f2; }
                .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
            ` }} />
        </form>
    );
};

export default EventRSVPForm;

