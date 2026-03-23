import axiosInstance from "./axiosInstance";

/**
 * Get personal data for the logged-in user
 * @returns {Promise}
 */
export const getMyPersonalData = async () => {
    try {
        const { data } = await axiosInstance.get("/personal-data");
        return data.personalData || [];
    } catch (error) {
        console.error("Get personal data error:", error);
        throw error;
    }
};

/**
 * Create a personal data entry with file upload
 * @param {FormData} formData 
 * @returns {Promise}
 */
export const createPersonalData = async (formData) => {
    try {
        const { data } = await axiosInstance.post("/personal-data", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    } catch (error) {
        console.error("Create personal data error:", error);
        throw error;
    }
};

/**
 * Get a single personal data entry by ID
 * @param {string} id 
 * @returns {Promise}
 */
export const getPersonalDataById = async (id) => {
    try {
        const { data } = await axiosInstance.get(`/personal-data/${id}`);
        return data.personalData;
    } catch (error) {
        console.error("Get Personal Data By ID Error:", error);
        throw error;
    }
};

/**
 * Update an existing personal data entry
 * @param {string} id 
 * @param {Object} payload 
 * @returns {Promise}
 */
export const updatePersonalData = async (id, payload) => {
    try {
        const { data } = await axiosInstance.put(`/personal-data/${id}`, payload);
        return data;
    } catch (error) {
        console.error("Update Personal Data Error:", error);
        throw error;
    }
};

/**
 * Delete a personal data entry
 * @param {string} id 
 * @returns {Promise}
 */
export const deletePersonalData = async (id) => {
    try {
        const { data } = await axiosInstance.delete(`/personal-data/${id}`);
        return data;
    } catch (error) {
        console.error("Delete Personal Data Error:", error);
        throw error;
    }
};
