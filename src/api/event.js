import axiosInstance from "./axiosInstance";

/**
 * Create a new event
 * @param {Object} eventData - Event data including files
 * @returns {Promise} - Created event data
 */
// export const createEvent = async (eventData) => {
//     const formData = new FormData();

//     // Append all event fields
//     if (eventData.eventName) formData.append("eventName", eventData.eventName);
//     if (eventData.eventType) formData.append("eventType", eventData.eventType);
//     if (eventData.startDate) formData.append("startDate", eventData.startDate);
//     if (eventData.startTime) formData.append("startTime", eventData.startTime);
//     if (eventData.endDate) formData.append("endDate", eventData.endDate);
//     if (eventData.endTime) formData.append("endTime", eventData.endTime);

//     // Optional fields
//     if (eventData.location) formData.append("location", eventData.location);
//     if (eventData.virtualLink) formData.append("virtualLink", eventData.virtualLink);
//     if (eventData.eventDetails) formData.append("eventDetails", eventData.eventDetails);

//     // Append guests as JSON string
//     if (eventData.guests && eventData.guests.length > 0) {
//         formData.append("guests", JSON.stringify(eventData.guests));
//     }

//     // Append guestListId if provided
//     if (eventData.guestListId) {
//         formData.append("guestListId", eventData.guestListId);
//     }

//     // Append inviteAllFamily flag
//     if (eventData.inviteAllFamily) {
//         formData.append("inviteAllFamily", eventData.inviteAllFamily);
//     }

//     // Append cover image file if exists
//     if (eventData.coverImage) {
//         formData.append("coverImage", eventData.coverImage);
//     }

//     try {
//         const res = await axiosInstance.post("/events/create", formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });

//         return res.data.data;
//     } catch (error) {
//         console.error("Create Event Error:", error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || "Failed to create event");
//     }
// };

export const createEvent = async (eventData) => {
    const formData = new FormData();

    // Required fields
    formData.append("eventName", eventData.eventName);
    formData.append("eventType", eventData.eventType);
    formData.append("startDate", eventData.startDate);
    formData.append("startTime", eventData.startTime);
    formData.append("endDate", eventData.endDate);
    formData.append("endTime", eventData.endTime);

    // Conditional fields based on event type
    if (eventData.eventType === "inperson" && eventData.location) {
        formData.append("location", eventData.location);
        if (eventData.googleMapLink) {
            formData.append("googleMapLink", eventData.googleMapLink);
        }
    }

    if (eventData.eventType === "virtual" && eventData.virtualLink) {
        formData.append("virtualLink", eventData.virtualLink);
    }

    // Optional fields
    if (eventData.eventDetails) {
        formData.append("eventDetails", eventData.eventDetails);
    }

    // Internal guests (users from app)
    if (eventData.guests?.length > 0) {
        formData.append("guests", JSON.stringify(eventData.guests));
    }

    // External guests (email / phone contacts)
    if (eventData.externalGuests?.length > 0) {
        formData.append(
            "externalGuests",
            JSON.stringify(eventData.externalGuests)
        );
    }

    // Guest list reference
    if (eventData.guestListId) {
        formData.append("guestListId", eventData.guestListId);
    }

    // Cover image
    if (eventData.coverImage instanceof File) {
        formData.append("coverImage", eventData.coverImage);
    }

    // WhatsApp Invitation Flags
    if (eventData.sendWhatsAppToFamily !== undefined) {
        formData.append("sendWhatsAppToFamily", eventData.sendWhatsAppToFamily);
    }
    if (eventData.sendWhatsAppToFriends !== undefined) {
        formData.append("sendWhatsAppToFriends", eventData.sendWhatsAppToFriends);
    }
    if (eventData.inviteWithFamily !== undefined) {
        formData.append("inviteWithFamily", eventData.inviteWithFamily);
    }
    if (eventData.friendsInviteWithFamily !== undefined) {
        formData.append("friendsInviteWithFamily", eventData.friendsInviteWithFamily);
    }

    try {
        const res = await axiosInstance.post(
            "/events/create",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return res.data.data;
    } catch (error) {
        console.error(
            "Create Event Error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to create event"
        );
    }
};

/**
 * Get all events with cursor-based pagination
 * @param {Object} params - Query parameters
 * @param {string} params.cursor - Cursor for pagination
 * @param {number} params.limit - Number of events to fetch
 * @param {string} params.id - Specific event ID (optional)
 * @returns {Promise} - List of events with pagination info
 */
export const getAllEvents = async ({ cursor = null, limit = 10, id = null } = {}) => {
    try {
        const params = {};
        if (cursor) params.cursor = cursor;
        if (limit) params.limit = limit;
        if (id) params.id = id;

        const { data } = await axiosInstance.get("/events", { params });
        console.log(data);
        return data;
    } catch (error) {
        console.error("Get Events Error:", error);
        throw error;
    }
};

/**
 * Get a single event by ID
 * @param {string} eventId - Event ID
 * @returns {Promise} - Event data
 */
export const getEventById = async (eventId) => {
    try {
        const { data } = await axiosInstance.get(`/events/${eventId}`);
        return data.data;
    } catch (error) {
        console.error("Get Event Error:", error);
        throw error;
    }
};

/**
 * Update an event
 * @param {string} eventId - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise} - Updated event data
 */
export const updateEvent = async ({ eventId, eventData }) => {
    const formData = new FormData();

    // Append all event fields
    Object.keys(eventData).forEach((key) => {
        if (
            key !== "coverImage" &&
            eventData[key] !== null &&
            eventData[key] !== undefined &&
            eventData[key] !== ""
        ) {
            if (key === "guests" && Array.isArray(eventData[key])) {
                formData.append(key, JSON.stringify(eventData[key]));
            } else {
                formData.append(key, eventData[key]);
            }
        }
    });

    // Append cover image file if exists
    if (eventData.coverImage) {
        formData.append("coverImage", eventData.coverImage);
    }

    try {
        const res = await axiosInstance.put(`/events/${eventId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data.data;
    } catch (error) {
        console.error("Update Event Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update event");
    }
};

/**
 * Delete an event
 * @param {string} eventId - Event ID
 * @returns {Promise} - Deletion confirmation
 */
export const deleteEvent = async (eventId) => {
    try {
        const { data } = await axiosInstance.delete(`/events/${eventId}`);
        return data;
    } catch (error) {
        console.error("Delete Event Error:", error);
        throw error;
    }
};
/**
 * RSVP to an event
 * @param {string} eventId - Event ID
 * @param {string} status - "accepted", "rejected", "maybe"
 * @returns {Promise} - Response data
 */
export const respondToEvent = async (eventId, status) => {
    try {
        const { data } = await axiosInstance.put(`/events/${eventId}/rsvp`, { status });
        return data;
    } catch (error) {
        console.error("RSVP Error:", error);
        throw error;
    }
};

/**
 * Get public event by ID (No Auth)
 * @param {string} eventId 
 * @returns {Promise} - Event data
 */
export const getPublicEventById = async (eventId) => {
    try {
        const { data } = await axiosInstance.get(`/events/public/${eventId}`);
        return data.data;
    } catch (error) {
        console.error("Get Public Event Error:", error);
        throw error;
    }
};

/**
 * RSVP to public event (No Auth)
 * @param {string} eventId 
 * @param {Object} data - { name, mobile, status }
 * @returns {Promise} 
 * @returns {Promise}
 */
export const respondToEventPublic = async (eventId, data) => {
    try {
        const res = await axiosInstance.put(`/events/public/${eventId}/rsvp`, data);
        return res.data;
    } catch (error) {
        console.error("Public RSVP Error:", error);
        throw error;
    }
};

/**
 * Add external guest to event (Host only)
 * @param {string} eventId
 * @param {Object} guestData - { name, mobile, email, relation }
 * @returns {Promise}
 */
export const addExternalGuest = async (eventId, guestData) => {
    try {
        const { data } = await axiosInstance.post(`/events/${eventId}/external-guests`, guestData);
        return data.data;
    } catch (error) {
        console.error("Add External Guest Error:", error);
        throw error;
    }
};

/**
 * Get events created by current user
 * @param {Object} params - { cursor, limit }
 * @returns {Promise}
 */
export const getMyEvents = async ({ cursor = null, limit = 10 } = {}) => {
    try {
        const params = {};
        if (cursor) params.cursor = cursor;
        if (limit) params.limit = limit;

        const { data } = await axiosInstance.get("/events/mine", { params });
        return data;
    } catch (error) {
        console.error("Get My Events Error:", error);
        throw error;
    }
};

/**
 * Get Consolidated Guest List (Invites + RSVPs)
 * @param {string} eventId 
 * @param {Object} params - { page, limit }
 * @returns {Promise} - { data: [], stats: {}, event: {}, pagination: {} }
 */
export const getEventGuestList = async (eventId, { page = 1, limit = 10 } = {}) => {
    try {
        const { data } = await axiosInstance.get(`/events/${eventId}/guest-list`, {
            params: { page, limit }
        });
        return data;
    } catch (error) {
        console.error("Get Guest List Error:", error);
        throw error;
    }
};
/**
 * Get Received Invitations (My Follow-up Events)
 * @param {string} type - "pending", "accepted", "history"
 * @returns {Promise} - List of events
 */
export const getReceivedInvitations = async (type = "") => {
    try {
        const { data } = await axiosInstance.get("/events/invitations", {
            params: { type }
        });
        return data.data;
    } catch (error) {
        console.error("Get Invitations Error:", error);
        throw error;
    }
};
/**
 * Mark attendance at the venue (Public)
 * @param {string} eventId 
 * @param {Object} data - { name, mobile }
 * @returns {Promise}
 */
export const markEventAttendance = async (eventId, data) => {
    try {
        const res = await axiosInstance.post(`/events/public/${eventId}/attendance`, data);
        return res.data;
    } catch (error) {
        console.error("Attendance Error:", error);
        throw error;
    }
};

/**
 * Get attendance list for an event (Host only)
 * @param {string} eventId 
 * @returns {Promise}
 */
export const getEventAttendance = async (eventId) => {
    try {
        const { data } = await axiosInstance.get(`/events/${eventId}/attendance`);
        return data.data;
    } catch (error) {
        console.error("Get Attendance Error:", error);
        throw error;
    }
};
