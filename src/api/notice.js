import axiosInstance from "./axiosInstance";

export const createNoticeApi = async (formData) => {
    try {
        const res = await axiosInstance.post("/notice", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating notice:", error);
        throw error.response?.data || { message: "Something went wrong" };
    }
};

// ============================
// USER — Get Notices (Active + Not Expired Only)
// ============================
export const getUserNoticesApi = async ({
    page = 1,
    limit = 15,
    search = "",
    startDate = "",
    endDate = "",
}) => {
    try {
        const res = await axiosInstance.get("/notice/user", {
            params: { page, limit, search, startDate, endDate },
        });

        return res.data;
    } catch (error) {
        console.error("Error getting user notices:", error);
        throw error.response?.data || { message: "Something went wrong" };
    }
};



// ============================
// ADMIN — Get All Notices
// (Active, Expired, Removed, Pinned — All Data)
// ============================
export const getAdminNoticesApi = async ({
    page = 1,
    limit = 15,
    search = "",
    status = "",
    date = "",
}) => {
    try {
        const res = await axiosInstance.get("/notice/admin", {
            params: { page, limit, search, status, date },
        });

        return res.data;
    } catch (error) {
        console.error("Error getting admin notices:", error);
        throw error.response?.data || { message: "Something went wrong" };
    }
};


export const deleteNoticeApi = async (noticeId) => {
    try {
        const res = await axiosInstance.delete(`/notice/${noticeId}`);
        return res.data;
    } catch (error) {
        console.error("Error getting notices:", error);
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const updateNoticeApi = async (id, data) => {
    try {
        const res = await axiosInstance.put(`/notice/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating notice:", error);
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const toggleNoticePinApi = async (id) => {
    try {
        const res = await axiosInstance.patch(`/notice/${id}/pin`);
        return res.data;
    } catch (error) {
        console.error("Error pinning notice:", error);
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const getNoticeByIdApi = async (id) => {
    try {
        const res = await axiosInstance.get(`/notice/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error getting notice by id:", error);
        throw error.response?.data || { message: "Something went wrong" };
    }
};
