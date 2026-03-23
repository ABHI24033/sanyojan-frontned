import axiosInstance from "./axiosInstance";

/**
 * Get all external contacts for the current user
 * @returns {Promise<Array>} List of contacts
 */
export const getMyContacts = async () => {
    try {
        const { data } = await axiosInstance.get("/external-contacts");
        return data.data;
    } catch (error) {
        console.error("Get Contacts Error:", error);
        throw error;
    }
};

/**
 * Create a new external contact
 * @param {Object} contactData - { name, mobile, email, relation }
 * @returns {Promise<Object>} Created contact
 */
export const createContact = async (contactData) => {
    try {
        const { data } = await axiosInstance.post("/external-contacts", contactData);
        return data.data;
    } catch (error) {
        console.error("Create Contact Error:", error);
        throw error;
    }
};

/**
 * Delete a contact
 * @param {string} id - Contact ID
 * @returns {Promise}
 */
export const deleteContact = async (id) => {
    try {
        const { data } = await axiosInstance.delete(`/external-contacts/${id}`);
        return data;
    } catch (error) {
        console.error("Delete Contact Error:", error);
        throw error;
    }
};
