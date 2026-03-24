import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { QRCodeCanvas } from "qrcode.react";
import AddFriendRelativeModal from "../modals/AddFriendRelativeModal";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import { useEvent } from "../../hooks/event/useEvent";
import AlertBox from "../ui/Alert";

export default function CreateEvent() {
    const {
        currentStep,
        nextStep,
        prevStep,
        createdEventId,
        allGuests,
        allExternalContacts,
        coverPreview,
        eventType,
        setEventType,
        selectedGuests,
        setSelectedGuests,
        selectedExternalContacts,
        setSelectedExternalContacts,
        toggleAllFamily,
        toggleAllExternal,
        eventName,
        setEventName,
        location,
        setLocation,
        googleMapLink,
        setGoogleMapLink,
        virtualLink,
        setVirtualLink,
        startDate,
        setStartDate,
        startTime,
        setStartTime,
        endDate,
        setEndDate,
        endTime,
        setEndTime,
        eventDetails,
        setEventDetails,
        handleCover,
        handleCreateEvent,
        alert,
        setAlert,
        createEventMutation,
        familyGuestModes,
        friendsGuestModes,
        setFamilyGuestMode,
        setFriendsGuestMode,
        activeBulkAction,
        setActiveBulkAction,
        resetForm,
        guestListName,
        setGuestListName,
        showSaveList,
        setShowSaveList,
        handleSaveGuestList,
        downloadQRCode,
        savedGuestLists,
        selectedGuestList,
        handleSelectSavedList
    } = useEvent();

    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [activeTab, setActiveTab] = useState("family");
    const navigate = useNavigate();

    // Compute today's date (local) in YYYY-MM-DD for date inputs
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const todayDateString = getTodayDateString();

    const isPastDate = (dateString) => {
        if (!dateString) return false;
        const selected = new Date(dateString);
        selected.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected < today;
    };

    const handleCreateEventClick = () => {
        if (isPastDate(startDate) || isPastDate(endDate)) {
            setAlert({
                type: "error",
                message: "Event dates cannot be in the past. Please select today or a future date.",
            });
            return;
        }

        handleCreateEvent();
    };

    // Helper to toggle single guest
    const toggleGuest = (guest, isExternal = false) => {
        if (isExternal) {
            if (selectedExternalContacts.find(g => g.id === guest.id)) {
                setSelectedExternalContacts(selectedExternalContacts.filter(g => g.id !== guest.id));
            } else {
                setSelectedExternalContacts([...selectedExternalContacts, guest]);
            }
        } else {
            if (selectedGuests.find(g => g.id === guest.id)) {
                setSelectedGuests(selectedGuests.filter(g => g.id !== guest.id));
            } else {
                setSelectedGuests([...selectedGuests, guest]);
            }
        }
    };

    const rsvpLink = createdEventId ? `${window.location.origin}/events/${createdEventId}?external=true` : "";

    return (
        <div className="container py-2 py-md-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-4">
                <button className="btn btn-link d-flex align-items-center text-decoration-none ps-0 text-muted fw-semibold transition-all hover-translate-x" onClick={() => navigate(-1)}>
                    <Icon icon="lucide:arrow-left" className="me-2" width="20" /> Back to Events
                </button>

                {/* Step Indicator */}
                <div className="d-flex align-items-center gap-2 gap-md-4">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="d-flex align-items-center">
                            <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all ${currentStep >= step ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted border'}`}
                                style={{ width: currentStep === step ? "36px" : "30px", height: currentStep === step ? "36px" : "30px", fontSize: "14px" }}>
                                {step}
                            </div>
                            <span className={`ms-2 d-none d-sm-inline small fw-bold ${currentStep >= step ? 'text-primary' : 'text-muted'}`} style={{ whiteSpace: 'nowrap' }}>
                                {step === 1 ? "Details" : step === 2 ? "People" : "Finish"}
                            </span>
                            {step < 3 && <div className={`ms-2 ms-md-3 border-top ${currentStep > step ? 'border-primary' : 'border-light'}`} style={{ width: "16px", borderTopWidth: '2px' }}></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="row  justify-content-center">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-2 p-lg-5">
                            {/* STEP 1: EVENT DETAILS */}
                            {currentStep === 1 && (
                                <div className="p-3 p-md-5 animation-fade-in">
                                    <div className="mb-4">
                                        <h4 className="fw-bold mb-1 fs-5 fs-md-4">Step 1: Event Details</h4>
                                        <p className="text-muted smaller">Provide the core details of your event</p>
                                    </div>

                                    <div className="row g-4">
                                        <div className="col-lg-6">
                                            <div className="mb-4">
                                                <label className="form-label fw-semibold mb-2 d-flex align-items-center">
                                                    <Icon icon="mdi:image" className="me-2 text-primary" />
                                                    Event Cover Photo
                                                </label>
                                                <div
                                                    className="border rounded-4 overflow-hidden position-relative bg-light transition-all hover-shadow-sm"
                                                    style={{ height: "240px", cursor: "pointer", borderStyle: "dashed !important" }}
                                                    onClick={() => document.getElementById("coverInput").click()}
                                                >
                                                    {coverPreview ? (
                                                        <img src={coverPreview} alt="cover" className="w-100 h-100 object-fit-cover" />
                                                    ) : (
                                                        <div className="d-flex flex-column justify-content-center align-items-center h-100 p-4 text-center">
                                                            <Icon icon="solar:camera-add-linear" width={48} className="text-muted mb-3 opacity-50" />
                                                            <p className="text-muted mb-1 fw-medium">Upload Cover Photo</p>
                                                            <span className="text-muted smaller">1200x600px recommended</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <input type="file" id="coverInput" accept="image/*" onChange={handleCover} style={{ display: "none" }} />
                                            </div>

                                            <Input
                                                label={<><Icon icon="mdi:text" className="me-2 text-primary" /> Event Name</>}
                                                placeholder="e.g. Grandma's 80th Birthday"
                                                value={eventName}
                                                onChange={(e) => setEventName(e.target.value)}
                                                required
                                            />

                                            <div className="mb-3">
                                                <label className="form-label fw-semibold d-flex align-items-center">
                                                    <Icon icon="mdi:format-list-bulleted" className="me-2 text-primary" /> Event Type
                                                </label>
                                                <div className="row g-2">
                                                    <div className="col-6">
                                                        <button type="button" className={`btn w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 ${eventType === 'inperson' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                            onClick={() => setEventType("inperson")}>
                                                            <Icon icon="mdi:map-marker" /> In-Person
                                                        </button>
                                                    </div>
                                                    <div className="col-6">
                                                        <button type="button" className={`btn w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 ${eventType === 'virtual' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                            onClick={() => setEventType("virtual")}>
                                                            <Icon icon="mdi:video" /> Virtual
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {eventType === "inperson" ? (
                                                <Input
                                                    label={<><Icon icon="mdi:map-marker" className="me-2 text-primary" /> Venue Address</>}
                                                    placeholder="Enter location"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            ) : (
                                                <Input
                                                    label={<><Icon icon="mdi:link-variant" className="me-2 text-primary" /> Meeting Link</>}
                                                    placeholder="https://zoom.us/j/..."
                                                    value={virtualLink}
                                                    onChange={(e) => setVirtualLink(e.target.value)}
                                                />
                                            )}
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="mb-4">
                                                <label className="form-label fw-semibold mb-3 d-flex align-items-center">
                                                    <Icon icon="mdi:clock-outline" className="me-2 text-primary" /> Event Schedule
                                                </label>
                                                <div className="card border-0 bg-light rounded-4 p-3 mb-3">
                                                    <p className="small text-muted mb-2 fw-semibold">Start Date & Time</p>
                                                    <div className="row g-2">
                                                        <div className="col-7">
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                value={startDate}
                                                                min={todayDateString}
                                                                onChange={(e) => setStartDate(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-5">
                                                            <input
                                                                type="time"
                                                                className="form-control"
                                                                value={startTime}
                                                                onChange={(e) => setStartTime(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card border-0 bg-light rounded-4 p-3">
                                                    <p className="small text-muted mb-2 fw-semibold">End Date & Time</p>
                                                    <div className="row g-2">
                                                        <div className="col-7">
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                value={endDate}
                                                                min={todayDateString}
                                                                onChange={(e) => setEndDate(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-5">
                                                            <input
                                                                type="time"
                                                                className="form-control"
                                                                value={endTime}
                                                                onChange={(e) => setEndTime(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {eventType === "inperson" && (
                                                <Input
                                                    label={<><Icon icon="mdi:google-maps" className="me-2 text-primary" /> Google Map Link (Optional)</>}
                                                    placeholder="https://maps.app.goo.gl/..."
                                                    value={googleMapLink}
                                                    onChange={(e) => setGoogleMapLink(e.target.value)}
                                                />
                                            )}

                                            <TextArea
                                                label={<><Icon icon="mdi:text-box-outline" className="me-2 text-primary" /> Event Description</>}
                                                placeholder="Share more details about your event..."
                                                value={eventDetails}
                                                onChange={(e) => setEventDetails(e.target.value)}
                                                rows={5}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 mt-md-5 d-flex justify-content-end">
                                        <button type="button" className="btn btn-primary w-100 w-md-auto px-5 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center" onClick={nextStep}>
                                            Next: Invitations <Icon icon="mdi:arrow-right" className="ms-2" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: INVITATION */}
                            {currentStep === 2 && (
                                <div className="p-5 animation-fade-in">
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div>
                                            <h4 className="fw-bold fs-4 mb-1">Step 2: Guest Invitation</h4>
                                            <p className="text-muted small">Select who you'd like to invite</p>
                                        </div>
                                        <button type="button" className="btn btn-outline-primary d-flex align-items-center btn-sm rounded-pill" onClick={() => setShowAddFriendModal(true)}>
                                            <Icon icon="mdi:account-plus" className="me-1" /> Add New Friend
                                        </button>
                                    </div>

                                    {/* Saved List Selection */}
                                    {savedGuestLists.length > 0 && (
                                        <div className="mb-4">
                                            <div className="card border-0 bg-light rounded-4 p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                                <div>
                                                    <p className="small text-muted mb-0 fw-semibold">Quick Select:</p>
                                                    <h6 className="fw-bold mb-0">Use a Saved Group</h6>
                                                </div>
                                                <select
                                                    className="form-select border-0 shadow-sm rounded-3 py-2 px-3 fw-medium"
                                                    style={{ maxWidth: '300px' }}
                                                    value={selectedGuestList}
                                                    onChange={handleSelectSavedList}
                                                >
                                                    <option value="">-- Choose a Group --</option>
                                                    {savedGuestLists.map(list => (
                                                        <option key={list._id} value={list._id}>{list.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tabs */}
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                                        <ul className="nav nav-tabs border-bottom-0 flex-nowrap hide-scrollbar mb-0" role="tablist">
                                            <li className="nav-item flex-shrink-0">
                                                <button type="button" className={`nav-link border-0 fw-bold px-3 px-md-4 py-3 border rounded-top-4 small ${activeTab === 'family' ? 'active bg-primary text-white shadow-sm' : 'text-muted hover-bg-light'}`}
                                                    onClick={() => setActiveTab("family")}>
                                                    Family Tree ({allGuests.length})
                                                </button>
                                            </li>
                                            <li className="nav-item flex-shrink-0">
                                                <button type="button" className={`nav-link border-0 fw-bold px-3 px-md-4 py-3 border rounded-top-4 small ${activeTab === 'friends' ? 'active bg-primary text-white shadow-sm' : 'text-muted hover-bg-light'}`}
                                                    onClick={() => setActiveTab("friends")}>
                                                    Friends ({allExternalContacts.length})
                                                </button>
                                            </li>
                                        </ul>

                                        {(selectedGuests.length > 0 || selectedExternalContacts.length > 0) && (
                                            <div className="d-flex flex-wrap gap-2 justify-content-end align-items-center">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm d-flex align-items-center gap-1 rounded-3 px-3 py-2 ${activeBulkAction === 'no_whatsapp' ? 'btn-secondary shadow-sm' : 'btn-outline-secondary'}`}
                                                    onClick={() => {
                                                        const targetList = activeTab === 'family' ? selectedGuests : selectedExternalContacts;
                                                        const modeSetter = activeTab === 'family' ? setFamilyGuestMode : setFriendsGuestMode;
                                                        targetList.forEach(g => modeSetter(g.id, "no_whatsapp"));
                                                        setActiveBulkAction("no_whatsapp");
                                                    }}
                                                >
                                                    <Icon icon="mdi:whatsapp-off" />
                                                    No WhatsApp
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm d-flex align-items-center gap-1 rounded-3 px-3 py-2 ${activeBulkAction === 'with_family' ? 'btn-primary shadow-sm' : 'btn-outline-primary'}`}
                                                    onClick={() => {
                                                        const targetList = activeTab === 'family' ? selectedGuests : selectedExternalContacts;
                                                        const modeSetter = activeTab === 'family' ? setFamilyGuestMode : setFriendsGuestMode;
                                                        targetList.forEach(g => modeSetter(g.id, "with_family"));
                                                        setActiveBulkAction("with_family");
                                                    }}
                                                >
                                                    <Icon icon="mdi:account-group-outline" />
                                                    Invite With Family
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm d-flex align-items-center gap-1 rounded-3 px-3 py-2 ${activeBulkAction === 'without_family' ? 'btn-primary shadow-sm' : 'btn-outline-primary'}`}
                                                    onClick={() => {
                                                        const targetList = activeTab === 'family' ? selectedGuests : selectedExternalContacts;
                                                        const modeSetter = activeTab === 'family' ? setFamilyGuestMode : setFriendsGuestMode;
                                                        targetList.forEach(g => modeSetter(g.id, "without_family"));
                                                        setActiveBulkAction("without_family");
                                                    }}
                                                >
                                                    <Icon icon="mdi:account-outline" />
                                                    Invite Without Family
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card border rounded-4 border-top-0 rounded-top-0 bg-white">
                                        <div className="card-body p-0">
                                            {/* Selection Header */}
                                            <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                                                <button type="button" className="btn btn-primary btn-sm fw-bold" onClick={activeTab === 'family' ? toggleAllFamily : toggleAllExternal}>
                                                    {((activeTab === 'family' && selectedGuests.length === allGuests.length) ||
                                                        (activeTab === 'friends' && selectedExternalContacts.length === allExternalContacts.length))
                                                        ? "Deselect All" : "Select All"}
                                                </button>
                                                <span className="small fw-bold text-primary">
                                                    {activeTab === 'family' ? selectedGuests.length : selectedExternalContacts.length} Selected
                                                </span>
                                            </div>

                                            {/* Guest List Body */}
                                            <div className="p-2 p-md-5 hide-scrollbar" style={{ maxHeight: "400px" }}>
                                                <div className="row g-2 p-10 g-md-3">
                                                    {(activeTab === 'family' ? allGuests : allExternalContacts)
                                                        .map((guest) => {
                                                            const isSelected = !!(activeTab === 'family' ? selectedGuests : selectedExternalContacts).find(g => g.id === guest.id);
                                                            const currentMode = (activeTab === 'family' ? familyGuestModes : friendsGuestModes)[guest.id] || "with_family";

                                                            return (
                                                                <div className="col-12 col-md-4" key={guest.id}>
                                                                    <div
                                                                        className={`card border-0 rounded-4 p-2 p-md-3 transition-all ${isSelected ? 'shadow-sm bg-primary bg-opacity-10 border border-primary border-opacity-25' : 'bg-light bg-opacity-50 hover-bg-light border border-transparent'}`}
                                                                    >
                                                                        <div className="position-absolute top-0 end-0 m-2">
                                                                            {currentMode === 'no_whatsapp' && <Icon icon="mdi:whatsapp-off" className="text-danger" title="No WhatsApp" />}
                                                                            {currentMode === 'with_family' && <Icon icon="mdi:account-group-outline" className="text-primary" title="Invite With Family" />}
                                                                            {currentMode === 'without_family' && <Icon icon="mdi:account-outline" className="text-primary" title="Invite Without Family" />}
                                                                        </div>
                                                                        <div
                                                                            className="d-flex align-items-center gap-2 px-10 py-4 cursor-pointer"
                                                                            onClick={() => toggleGuest(guest, activeTab === 'friends')}
                                                                        >
                                                                            <div className="form-check m-0">
                                                                                <input
                                                                                    className="form-check-input"
                                                                                    type="checkbox"
                                                                                    readOnly
                                                                                    checked={isSelected}
                                                                                    style={{ width: '20px', height: '20px' }}
                                                                                />
                                                                            </div>
                                                                            <div className="flex-shrink-0">
                                                                                {guest.avatar ? (
                                                                                    <img
                                                                                        src={guest.avatar}
                                                                                        className="rounded-circle shadow-sm border border-2 border-white"
                                                                                        width="44"
                                                                                        height="44"
                                                                                        alt={guest.name}
                                                                                    />
                                                                                ) : (
                                                                                    <div
                                                                                        className="rounded-circle bg-primary-focus shadow-sm d-flex align-items-center justify-content-center text-primary fw-bold border border-2 border-white"
                                                                                        style={{ width: "44px", height: "44px" }}
                                                                                    >
                                                                                        {guest.name.charAt(0)}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="overflow-hidden">
                                                                                <h6 className={`mb-0 fw-bold text-sm text-truncate ${isSelected ? 'text-primary' : ''}`}>
                                                                                    {guest.name}
                                                                                </h6>
                                                                                <p className="smaller text-muted mb-0">
                                                                                    {guest.phone || guest.email || guest.relation}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Invite Format Controls removed – behavior now driven by Invitation Mode */}

                                    <div className="mt-5 d-flex flex-column flex-md-row justify-content-between gap-3">
                                        <button type="button" className="btn btn-light px-4 py-1 d-flex align-items-center justify-content-center fw-bold rounded-3 order-2 order-md-1" onClick={prevStep}>
                                            <Icon icon="mdi:arrow-left" className="me-2" /> Details
                                        </button>

                                        <div className="d-flex flex-column flex-md-row gap-2 order-1 order-md-2">
                                            {selectedGuests.length + selectedExternalContacts.length > 0 && !showSaveList && (
                                                // <button type="button" className="btn btn-outline-primary px-4 py-3 fw-bold rounded-3" onClick={() => setShowSaveList(true)}>
                                                //     <Icon icon="mdi:content-save-outline" className="me-2" /> Save List
                                                // </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm px-3 py-1 fw-semibold rounded-3"
                                                    onClick={() => setShowSaveList(true)}
                                                >
                                                    <Icon icon="mdi:content-save-outline" width="16" className="me-1" />
                                                    Save List
                                                </button>
                                            )}

                                            <button
                                                className="btn btn-primary px-5 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center"
                                                onClick={handleCreateEventClick}
                                                disabled={createEventMutation.isPending}
                                            >
                                                {createEventMutation.isPending ? (
                                                    <><span className="spinner-border spinner-border-sm me-2"></span> Creating...</>
                                                ) : (
                                                    <><Icon icon="mdi:calendar-check" className="me-2" /> Create Event & Get QR</>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {showSaveList && (
                                        <div className="mt-4 p-4 p-md-5 bg-white rounded-5 shadow-lg border border-primary border-opacity-10 animate-fade-in">
                                            <div className="text-center mb-4">
                                                <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-3">
                                                    <Icon icon="mdi:folder-star" width={32} />
                                                </div>
                                                <h5 className="fw-bold mb-1">Save this Guest List</h5>
                                                <p className="text-muted smaller">Re-use this selection for your future events</p>
                                            </div>

                                            <div className="d-flex flex-column gap-3">
                                                <input
                                                    type="text"
                                                    className="form-control form-input-premium text-center fs-5 py-3"
                                                    placeholder="e.g. Family Members"
                                                    value={guestListName}
                                                    onChange={(e) => setGuestListName(e.target.value)}
                                                />
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-primary flex-grow-1 py-3 fw-bold rounded-4 shadow-sm" onClick={handleSaveGuestList}>Save Group</button>
                                                    <button className="btn btn-light px-4 py-3 fw-bold rounded-4" onClick={() => setShowSaveList(false)}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: QR CODE */}
                            {currentStep === 3 && (
                                <div className="p-5 animation-fade-in text-center">
                                    <div className="mb-4">
                                        <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex p-3 mb-3 text-success">
                                            <Icon icon="mdi:check-circle" width={48} />
                                        </div>
                                        <h4 className="fw-bold mb-1">Event Created Successfully!</h4>
                                        <p className="text-muted small">Your event is ready. Here are your QR codes.</p>
                                    </div>

                                    <div className="row py-5 g-3 g-md-4 mb-5">
                                        {/* RSVP QR */}
                                        <div className="col-12 col-md-6">
                                            <div className=" bg-white h-100">
                                                <div id="rsvp-qr-container" className="mb-3 d-flex justify-content-center">
                                                    <QRCodeCanvas
                                                        id="rsvp-canvas"
                                                        value={rsvpLink}
                                                        size={160}
                                                        level={"H"}
                                                        includeMargin={true}
                                                    />
                                                </div>
                                                <h6 className="fw-bold mb-1 small">Digital RSVP</h6>
                                                <p className="smaller text-muted mb-3">For digital registration</p>
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => {
                                                        navigator.clipboard.writeText(rsvpLink);
                                                        setAlert({ type: "success", message: "RSVP Link copied!" });
                                                    }}>
                                                        <Icon icon="mdi:content-copy" className="me-1" /> Link
                                                    </button>
                                                    <button className="btn btn-sm btn-success" onClick={() => downloadQRCode("#rsvp-canvas", "rsvp-qr")}>
                                                        <Icon icon="mdi:download" className="me-1" /> Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Attendance QR */}
                                        <div className="col-12 col-md-6">
                                            <div className="bg-white h-100">
                                                <div id="attendance-qr-container" className="mb-3 d-flex justify-content-center">
                                                    <QRCodeCanvas
                                                        id="attendance-canvas"
                                                        value={`${window.location.origin}/events/${createdEventId}/attendance`}
                                                        size={160}
                                                        level={"H"}
                                                        includeMargin={true}
                                                    />
                                                </div>
                                                <h6 className="fw-bold mb-1 small">Venue Entry</h6>
                                                <p className="smaller text-muted mb-3">For physical arrival</p>
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => {
                                                        const link = `${window.location.origin}/events/${createdEventId}/attendance`;
                                                        navigator.clipboard.writeText(link);
                                                        setAlert({ type: "success", message: "Attendance Link copied!" });
                                                    }}>
                                                        <Icon icon="mdi:content-copy" className="me-1" /> Link
                                                    </button>
                                                    <button className="btn btn-sm btn-success" onClick={() => downloadQRCode("#attendance-canvas", "venue-attendance-qr")}>
                                                        <Icon icon="mdi:download" className="me-1" /> Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="max-w-400 mx-auto">
                                        <div className="d-flex flex-wrap gap-2">
                                            <button className="btn btn-primary flex-grow-1 py-3 fw-bold rounded-3" onClick={() => navigate("/invitations")}>
                                                Go to My Events
                                            </button>
                                            <button className="btn btn-outline-primary flex-grow-1 py-3 fw-bold rounded-3" onClick={() => resetForm()}>
                                                Create Another
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AlertBox alert={alert} setAlert={setAlert} />
            <AddFriendRelativeModal show={showAddFriendModal} onHide={() => setShowAddFriendModal(false)} />

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-bg-light:hover { background-color: #f8f9fa; }
                .hover-shadow-sm:hover { box-shadow: 0 .125rem .25rem rgba(0,0,0,.075); }
                .transition-all { transition: all 0.2s ease-in-out; }
                .cursor-pointer { cursor: pointer; }
                .smaller { font-size: 0.75rem; }
                .max-w-400 { max-width: 400px; }
                .animation-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
