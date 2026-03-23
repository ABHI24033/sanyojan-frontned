import axiosInstance from "./axiosInstance";

const createProfileFormData = (form) => {
    const formData = new FormData();

    // Add file with correct field name 'profilePicture' (backend expects this)
    // Only append if it's an actual File object, not a string URL
    if (form.profileImage && typeof form.profileImage !== 'string') {
        formData.append('profilePicture', form.profileImage);
    }

    // Add pending PDF documents
    if (form.pendingUploadFiles && form.pendingUploadFiles.length > 0) {
        form.pendingUploadFiles.forEach((file, index) => {
            formData.append(`lifeHistoryDocuments`, file);
        });
    }

    // Add all other form fields
    Object.keys(form).forEach((key) => {
        // Skip profileImage and pendingUploadFiles as we handle them above
        if (key === 'profileImage' || key === 'pendingUploadFiles') return;
        
        // Skip lifeHistoryDocuments (already uploaded docs) - don't send to backend
        if (key === 'lifeHistoryDocuments') return;
        
        if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
            if (Array.isArray(form[key]) && (key === 'education' || key === 'employmentHistory')) {
                formData.append(key, JSON.stringify(form[key]));
            } else {
                // If it's an array for relationships (like sons, daughters), stringify if needed, or handle comma strings
                if (Array.isArray(form[key])) {
                    formData.append(key, JSON.stringify(form[key]));
                } else {
                    formData.append(key, form[key]);
                }
            }
        }
    });

    return formData;
};

export const submitProfile = async (form) => {
    const formData = createProfileFormData(form);
    console.log('Submitting profile with FormData');

    try {
        const res = await axiosInstance.post("/profile/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Profile Submit Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to submit profile data");
    }
};

export const updateProfile = async (form) => {
    const formData = createProfileFormData(form);
    console.log('Updating profile with FormData');

    try {
        const res = await axiosInstance.put("/profile/update", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Profile Update Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update profile data");
    }
};

export const updateUserProfileById = async (userId, form) => {
    const formData = createProfileFormData(form);
    console.log(`Updating profile for user ${userId} with FormData`);

    try {
        const res = await axiosInstance.put(`/profile/update/${userId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Profile Update By ID Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update user profile data");
    }
};

export const getUserProfile = async () => {
    console.log("Hello");

    try {
        const res = await axiosInstance.get("/profile/me");
        console.log(res);

        return res?.data;
    } catch (error) {
        console.error("Profile Update Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update profile data");
    }
}

// Get full user profile + posts
export const getUserProfileById = async (userId, cursor) => {
    try {
        const res = await axiosInstance.get(`/profile/${userId}`,
            {
                params: {
                    cursor: cursor || "",
                    limit: 10,
                },
            });
        return res.data;
    } catch (err) {
        console.error("Error fetching profile:", err);
        throw err.response?.data || err;
    }
};

// Get upcoming birthdays and anniversaries
export const getUpcomingCelebrations = async () => {
    try {
        const res = await axiosInstance.get("/profile/birthdays-anniversaries");
        console.log(res);
        return res.data;
    } catch (err) {
        console.error("Error fetching celebrations:", err);
        throw err.response?.data || err;
    }
};

// Upload life history document (PDF only, max 5MB)
export const uploadLifeHistoryDocument = async (file) => {
    const formData = new FormData();
    formData.append('document', file);

    try {
        const res = await axiosInstance.post("/profile/upload-document", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Document Upload Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.response?.data?.error || "Failed to upload document");
    }
};

// Remove life history document
export const removeLifeHistoryDocument = async (documentId) => {
    try {
        const res = await axiosInstance.delete(`/profile/remove-document/${documentId}`);
        return res.data;
    } catch (error) {
        console.error("Document Remove Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to remove document");
    }
};
