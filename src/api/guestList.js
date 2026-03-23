import axiosInstance from "./axiosInstance";

/**
 * Get all guest lists for current user
 * @returns {Promise<Array>} List of guest lists
 */
export const getMyGuestLists = async () => {
    try {
        const { data } = await axiosInstance.get("/guest-lists");
        return data.data;
    } catch (error) {
        console.error("Get Guest Lists Error:", error);
        throw error;
    }
};

/**
 * Create a new guest list
 * @param {Object} listData - { name, members, externalMembers }
 * @returns {Promise<Object>} Created list
 */
export const createGuestList = async (listData) => {
    try {
        const { data } = await axiosInstance.post("/guest-lists", listData);
        return data.data;
    } catch (error) {
        console.error("Create Guest List Error:", error);
        throw error;
    }
};

/**
 * Delete a guest list
 * @param {string} id - List ID
 * @returns {Promise}
 */
export const deleteGuestList = async (id) => {
    try {
        const { data } = await axiosInstance.delete(`/guest-lists/${id}`);
        return data;
    } catch (error) {
        console.error("Delete Guest List Error:", error);
        throw error;
    }
};
