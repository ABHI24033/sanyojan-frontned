import axiosInstance from "./axiosInstance";

export const getAdministrators = async () => {
  const res = await axiosInstance.get("/roles/administrators");
  return res.data;
};

export const getSubAdmins = async () => {
  const res = await axiosInstance.get("/roles/subadmins");
  return res.data;
};

export const createSubAdmin = async (payload) => {
  const res = await axiosInstance.post("/roles/subadmins", payload);
  return res.data;
};

export const deactivateSubAdmin = async (userId) => {
  const res = await axiosInstance.patch(`/roles/deactivate/${userId}`, { role: "subadmin" });
  return res.data;
};

export const getCoordinators = async () => {
  const res = await axiosInstance.get("/roles/coordinators");
  return res.data;
};

export const createCoordinator = async (payload) => {
  const res = await axiosInstance.post("/roles/coordinators", payload);
  return res.data;
};

export const deactivateCoordinator = async (userId) => {
  const res = await axiosInstance.patch(`/roles/deactivate/${userId}`, { role: "coordinator" });
  return res.data;
};

export const getUsersForRoleAssignment = async () => {
  const res = await axiosInstance.get("/roles/users");
  return res.data;
};

export const setUserRole = async ({ userId, role, enabled }) => {
  const res = await axiosInstance.patch(`/roles/role/${userId}`, { role, enabled });
  return res.data;
};
