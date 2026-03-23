import axiosInstance from "./axiosInstance";

export const getNotifications = async ({ limit = 10, cursor = null }) => {
    const { data } = await axiosInstance.get("/notifications", {
        params: { limit, cursor },
    });
    return data;
};

export const deleteNotification = async (id) => {
    const { data } = await axiosInstance.delete(`/notifications/${id}`);
    return data;
};

export const archiveNotification = async (id) => {
    const { data } = await axiosInstance.patch(`/notifications/${id}/archive`);
    return data;
};
