import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/ritual-categories`;

// Get categories by religion (Public/Protected)
export const getCategoriesByReligion = async (religion) => {
    const response = await axios.get(`${API_URL}/religion/${religion}`, {
        withCredentials: true,
    });
    return response.data;
};

// Get all categories (Admin)
export const getAllCategories = async () => {
    const response = await axios.get(API_URL, {
        withCredentials: true,
    });
    return response.data;
};

// Create category (Admin)
export const createCategory = async (payload) => {
    const response = await axios.post(API_URL, payload, {
        withCredentials: true,
    });
    return response.data;
};

// Update category (Admin)
export const updateCategory = async (id, payload) => {
    const response = await axios.put(`${API_URL}/${id}`, payload, {
        withCredentials: true,
    });
    return response.data;
};

// Delete category (Admin)
export const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
    });
    return response.data;
};
