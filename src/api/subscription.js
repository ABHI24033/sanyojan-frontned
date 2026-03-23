import axiosInstance from "./axiosInstance";

// Create subscription order
export const createSubscriptionOrder = async () => {
    try {
        const response = await axiosInstance.post("/subscriptions/create-order");
        return response.data;
    } catch (error) {
        console.error("Create Order Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create order");
    }
};

// Verify payment
export const verifySubscriptionPayment = async (data) => {
    try {
        const response = await axiosInstance.post("/subscriptions/verify-payment", data);
        return response.data;
    } catch (error) {
        console.error("Verify Payment Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to verify payment");
    }
};

// Select subscription (for Free trial or initial choice)
export const selectSubscription = async (plan) => {
    try {
        const response = await axiosInstance.post("/subscriptions/select", { plan });
        return response.data;
    } catch (error) {
        console.error("Select Subscription Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to select subscription");
    }
};

// Get subscription status
export const getSubscriptionStatus = async () => {
    try {
        const response = await axiosInstance.get("/subscriptions/status");
        return response.data;
    } catch (error) {
        console.error("Get Subscription Status Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to get subscription status");
    }
}

// Get family members
export const getFamilyMembers = async () => {
    try {
        const response = await axiosInstance.get("/subscriptions/family");
        return response.data;
    } catch (error) {
        console.error("Get Family Members Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to get family members");
    }
};

// Add family member
export const addFamilyMember = async (phone) => {
    try {
        const response = await axiosInstance.post("/subscriptions/family/add", { phone });
        return response.data;
    } catch (error) {
        console.error("Add Family Member Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to add family member");
    }
};
