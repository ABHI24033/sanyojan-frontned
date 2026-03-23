import axiosInstance from "./axiosInstance";

// Get complete family tree for current user
export const getFamilyTree = async () => {
  try {
    const res = await axiosInstance.get("/family-tree");
    return res.data;
  } catch (error) {
    console.error("Get Family Tree Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch family tree");
  }
};

// Add a new family member
export const addFamilyMember = async (memberData) => {
  try {
    // Check if there's a file to upload
    const { file, ...restData } = memberData;

    let requestData;
    let headers = {};

    if (file) {
      // If file exists, use FormData
      const formData = new FormData();

      // Append all fields to FormData
      Object.keys(restData).forEach(key => {
        if (restData[key] !== undefined && restData[key] !== null && restData[key] !== '') {
          formData.append(key, restData[key]);
        }
      });

      // Append the file
      formData.append('profilePicture', file);

      requestData = formData;
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      // If no file, use regular JSON
      requestData = restData;
    }

    const res = await axiosInstance.post("/family-tree/add-member", requestData, {
      headers
    });
    return res.data;
  } catch (error) {
    console.error("Add Family Member Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add family member");
  }
};

// Get family tree statistics
export const getFamilyTreeStats = async () => {
  try {
    const res = await axiosInstance.get("/family-tree/stats");
    return res.data;
  } catch (error) {
    console.error("Get Family Tree Stats Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch family tree statistics");
  }
};

// Get all family members list (flat)
export const getFamilyMembersList = async () => {
  try {
    const res = await axiosInstance.get("/family-tree/members");
    return res.data;
  } catch (error) {
    console.error("Get Family Members List Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch family members list");
  }
};

// Update family member
export const updateFamilyMember = async (memberId, memberData) => {
  try {
    // Check if there's a file to upload
    const { file, ...restData } = memberData;

    let requestData;
    let headers = {};

    if (file) {
      // If file exists, use FormData
      const formData = new FormData();

      // Append all fields to FormData
      Object.keys(restData).forEach(key => {
        if (restData[key] !== undefined && restData[key] !== null && restData[key] !== '') {
          formData.append(key, restData[key]);
        }
      });

      // Append the file
      formData.append('profilePicture', file);

      requestData = formData;
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      // If no file, use regular JSON
      requestData = restData;
    }

    const res = await axiosInstance.put(`/family-tree/member/${memberId}`, requestData, {
      headers
    });
    return res.data;
  } catch (error) {
    console.error("Update Family Member Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update family member");
  }
};

// Remove family member relationship
export const removeFamilyMember = async (memberId, relationship) => {
  try {
    const res = await axiosInstance.delete("/family-tree/member", {
      data: { memberId, relationship }
    });
    return res.data;
  } catch (error) {
    console.error("Remove Family Member Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to remove family member");
  }
};

// Delete family member completely
export const deleteFamilyMember = async (memberId) => {
  try {
    const res = await axiosInstance.delete(`/family-tree/member/${memberId}`);
    return res.data;
  } catch (error) {
    console.error("Delete Family Member Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete family member");
  }
};



// Get top 6 family members for widget
export const getTopFamilyMembers = async () => {
  try {
    const res = await axiosInstance.get("/family-tree/top-members");
    return res.data;
  } catch (error) {
    console.error("Get Top Family Members Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch top family members");
  }
};

// Set Guardian for logged-in user
export const setGuardian = async (guardianId) => {
  try {
    const res = await axiosInstance.put("/family-tree/guardian", { guardianId });
    return res.data;
  } catch (error) {
    console.error("Set Guardian Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to set guardian");
  }
};
