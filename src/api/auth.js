import axiosInstance from "./axiosInstance";

// ==================== SIGN UP FLOW ====================

/**
 * Send OTP for Sign Up
 * @param {Object} data - { firstname, lastname, phone, password }
 * @returns {Promise<Object>} Response data
 */
export const sendSignUpOtp = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/send-otp", data);
    return response.data;
  } catch (error) {
    console.error("Send Sign Up OTP Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to send OTP");
  }
};

/**
 * Verify OTP for Sign Up
 * @param {Object} data - { phone, otp }
 * @returns {Promise<Object>} Response data
 */
export const verifySignUpOtp = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", data);
    return response.data;
  } catch (error) {
    console.error("Verify Sign Up OTP Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to verify OTP");
  }
};

/**
 * Resend OTP for Sign Up
 * @param {Object} data - { phone }
 * @returns {Promise<Object>} Response data
 */
export const resendSignUpOtp = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/resend-otp", data);
    return response.data;
  } catch (error) {
    console.error("Resend Sign Up OTP Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to resend OTP");
  }
};

/**
 * Set Password after Sign Up verification
 * @param {Object} data - { phone, password, confirm_password }
 * @returns {Promise<Object>} Response data
 */
export const setPassword = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/set-password", data);
    return response.data;
  } catch (error) {
    console.error("Set Password Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to set password");
  }
};

// ==================== SIGN IN FLOW ====================

/**
 * Send OTP for Sign In
 * @param {Object} data - { phone, password }
 * @returns {Promise<Object>} Response data
 */
export const signInUser = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login/send-otp", data);
    return response.data;
  } catch (error) {
    console.error("Sign In Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to sign in");
  }
};

/**
 * Verify OTP for Sign In
 * @param {Object} data - { phone, otp }
 * @returns {Promise<Object>} Response data
 */
export const verifySignInOtp = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login/verify-otp", data);
    console.log("verifySignInOtp response", response);
    return response.data;
  } catch (error) {
    console.error("Verify Sign In OTP Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to verify OTP");
  }
};

// ==================== FORGOT PASSWORD FLOW ====================

/**
 * Send OTP for Forgot Password
 * @param {Object} data - { phone }
 * @returns {Promise<Object>} Response data
 */
export const sendForgotOtp = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password/send-otp", data);
    return response.data;
  } catch (error) {
    console.error("Send Forgot Password OTP Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to send OTP");
  }
};

/**
 * Verify OTP for Forgot Password
 * @param {Object} data - { phone, otp }
 * @returns {Promise<Object>} Response data
 */
export const verifyForgotOtp = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password/verify-otp", data);
    return response.data;
  } catch (error) {
    console.error("Verify Forgot Password OTP Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to verify OTP");
  }
};

/**
 * Reset Password (Set New Password after Forgot Password)
 * @param {Object} data - { phone, otp, password, confirm_password }
 * @returns {Promise<Object>} Response data
 */
export const setNewPassword = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password/reset", data);
    return response.data;
  } catch (error) {
    console.error("Set New Password Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to reset password");
  }
};

/**
 * Update password for first-time login (admin-created members)
 * @param {Object} data - { password, confirm_password }
 * @returns {Promise<Object>} Response data
 */
export const updateFirstPassword = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/update-first-password", data);
    return response.data;
  } catch (error) {
    console.error("Update First Password Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update password");
  }
};

// ==================== GET CURRENT USER ====================

/**
 * Get Current User Info
 * @returns {Promise<Object>} Response data with user info and hasProfile
 */
export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Get Current User Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get current user");
  }
};

// ==================== LOGOUT ====================

/**
 * Logout User
 * @returns {Promise<Object>} Response data
 */
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to log out");
  }
};

// ==================== SUPER ADMIN ====================

/**
 * Get All Users IP (Super Admin)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} search - Search term
 * @returns {Promise<Object>} Response data
 */
export const getAllUsersIp = async (page = 1, limit = 10, search = '') => {
  try {
    const response = await axiosInstance.get(`/auth/admin/users-ip?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  } catch (error) {
    console.error("Get All Users IP Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch user IPs");
  }
};