import axiosInstance from "./axiosInstance";

/**
 * Get all system settings
 * @returns {Promise}
 */
export const getSystemSettings = async () => {
    try {
        const { data } = await axiosInstance.get("/settings");
        return data.settings || [];
    } catch (error) {
        console.error("Get Settings Error:", error);
        throw error;
    }
};

/**
 * Update a system setting
 * @param {Object} payload - { key, value }
 * @returns {Promise}
 */
export const updateSystemSetting = async (payload) => {
    try {
        const { data } = await axiosInstance.put("/settings", payload);
        return data;
    } catch (error) {
        console.error("Update Setting Error:", error);
        throw error;
    }
};
