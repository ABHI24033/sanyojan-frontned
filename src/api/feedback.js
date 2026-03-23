import axiosInstance from "./axiosInstance";

// Create new feedback
export const createFeedback = async (feedbackData) => {
    try {
        const res = await axiosInstance.post("/feedback", feedbackData);
        return res.data.data;
    } catch (error) {
        console.error("Create Feedback Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to submit feedback");
    }
};

// Get all feedback
export const getAllFeedback = async ({ category, page = 1, limit = 10 }) => {
    try {
        const { data } = await axiosInstance.get("/feedback", {
            params: { category, page, limit }
        });
        return data;
    } catch (error) {
        console.error("Get Feedback Error:", error);
        throw error;
    }
};
