import axiosInstance from "./axiosInstance";

/**
 * Get member report with filters
 * @param {Object} params - Filter parameters
 */
export const getMemberReport = async (params) => {
    const response = await axiosInstance.get('/reports/members', { params });
    return response.data;
};

/**
 * Get metadata for member report filters
 */
export const getMemberReportMetadata = async () => {
    const response = await axiosInstance.get('/reports/metadata');
    return response.data;
};
