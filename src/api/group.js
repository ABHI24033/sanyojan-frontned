import axiosInstance from "./axiosInstance";

export const getContactGroups = async () => {
    const res = await axiosInstance.get("/contact-groups");
    return res.data;
};

export const createContactGroup = async (groupData) => {
    const res = await axiosInstance.post("/contact-groups", groupData);
    return res.data;
};

export const updateContactGroup = async (id, groupData) => {
    const res = await axiosInstance.put(`/contact-groups/${id}`, groupData);
    return res.data;
};

export const deleteContactGroup = async (id) => {
    const res = await axiosInstance.delete(`/contact-groups/${id}`);
    return res.data;
};

export const getContactGroupById = async (id) => {
    const res = await axiosInstance.get(`/contact-groups/${id}`);
    return res.data;
};
