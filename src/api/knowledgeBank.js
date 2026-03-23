import axiosInstance from "./axiosInstance";

/**
 * Get knowledge bank entries for the logged-in user (religion set in profile)
 * @returns {Promise} - List of knowledge bank entries
 */
export const getMyKnowledgeBank = async () => {
    try {
        const { data } = await axiosInstance.get("/knowledge-bank/my");
        return data.knowledgeBanks || [];
    } catch (error) {
        console.error("Get My Knowledge Bank Error:", error);
        throw error;
    }
};

/**
 * Get knowledge bank entries by religion
 * @param {string} religion 
 * @returns {Promise}
 */
export const getKnowledgeBankByReligion = async (religion) => {
    try {
        const { data } = await axiosInstance.get(`/knowledge-bank/religion/${religion}`);
        return data.knowledgeBanks || [];
    } catch (error) {
        console.error("Get Knowledge Bank By Religion Error:", error);
        throw error;
    }
};

/**
 * Get all knowledge bank entries (Admin)
 * @returns {Promise}
 */
export const getAllKnowledgeBank = async () => {
    try {
        const { data } = await axiosInstance.get("/knowledge-bank/admin/all");
        return data.knowledgeBanks || [];
    } catch (error) {
        console.error("Get All Knowledge Bank Error:", error);
        throw error;
    }
};

/**
 * Create a new knowledge bank entry
 * @param {Object} payload 
 * @returns {Promise}
 */
export const createKnowledgeBank = async (payload) => {
    try {
        const { data } = await axiosInstance.post("/knowledge-bank", payload);
        return data;
    } catch (error) {
        console.error("Create Knowledge Bank Error:", error);
        throw error;
    }
};

/**
 * Get a single knowledge bank entry by ID (Admin)
 * @param {string} id 
 * @returns {Promise}
 */
export const getKnowledgeBankById = async (id) => {
    try {
        const { data } = await axiosInstance.get(`/knowledge-bank/${id}`);
        return data.knowledgeBank;
    } catch (error) {
        console.error("Get Knowledge Bank By ID Error:", error);
        throw error;
    }
};

/**
 * Update an existing knowledge bank entry
 * @param {string} id 
 * @param {Object} payload 
 * @returns {Promise}
 */
export const updateKnowledgeBank = async (id, payload) => {
    try {
        const { data } = await axiosInstance.put(`/knowledge-bank/${id}`, payload);
        return data;
    } catch (error) {
        console.error("Update Knowledge Bank Error:", error);
        throw error;
    }
};

/**
 * Delete a knowledge bank entry
 * @param {string} id 
 * @returns {Promise}
 */
export const deleteKnowledgeBank = async (id) => {
    try {
        const { data } = await axiosInstance.delete(`/knowledge-bank/${id}`);
        return data;
    } catch (error) {
        console.error("Delete Knowledge Bank Error:", error);
        throw error;
    }
};
