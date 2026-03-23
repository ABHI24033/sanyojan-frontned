import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MasterLayout from "../../masterLayout/MasterLayout";
import { createSubAdmin, deactivateSubAdmin, getSubAdmins, getUsersForRoleAssignment, setUserRole } from "../../api/roles";

const placeholderAvatar =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

export default function ManageSubAdminPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ firstname: "", lastname: "", phone: "" });
  const [searchUsers, setSearchUsers] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["subadmins"],
    queryFn: getSubAdmins,
    staleTime: 30 * 1000,
  });

  const rows = useMemo(() => data?.data || [], [data]);
  const hasSubAdmin = rows.length > 0;

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["usersForRoles"],
    queryFn: getUsersForRoleAssignment,
    staleTime: 30 * 1000,
  });

  const allUsers = useMemo(() => usersData?.data || [], [usersData]);
  const filteredUsers = useMemo(() => {
    const q = searchUsers.trim().toLowerCase();
    return allUsers
      .filter((u) => !u.isAdmin && !u.isSuperAdmin) // exclude main/super admin
      .filter((u) => {
        if (!q) return true;
        return (
          (u.name || "").toLowerCase().includes(q) ||
          (u.phone || "").toLowerCase().includes(q)
        );
      });
  }, [allUsers, searchUsers]);

  const createMutation = useMutation({
    mutationFn: createSubAdmin,
    onSuccess: () => {
      setForm({ firstname: "", lastname: "", phone: "" });
      queryClient.invalidateQueries({ queryKey: ["subadmins"] });
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
      queryClient.invalidateQueries({ queryKey: ["usersForRoles"] });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateSubAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subadmins"] });
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
      queryClient.invalidateQueries({ queryKey: ["usersForRoles"] });
    },
  });

  const assignMutation = useMutation({
    mutationFn: setUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subadmins"] });
      queryClient.invalidateQueries({ queryKey: ["coordinators"] });
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
      queryClient.invalidateQueries({ queryKey: ["usersForRoles"] });
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (hasSubAdmin) return;
    createMutation.mutate({
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      phone: form.phone.trim(),
      country_code: "+91",
    });
  };

  return (
    <MasterLayout>
      <div className="container">
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 mb-3">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold d-flex align-items-center">
                  <Icon icon="solar:users-group-rounded-linear" className="me-2" width={22} />
                  Assign From Users
                </h5>
                <p className="text-muted small mb-0 mt-1">
                  Select an existing user and make them a SubAdmin.
                </p>
              </div>
              <div className="card-body">
                {hasSubAdmin && (
                  <div className="alert alert-warning py-2">
                    Only one SubAdmin is allowed. Remove the current SubAdmin to assign a new one.
                  </div>
                )}
                <div className="position-relative mb-3">
                  <input
                    type="text"
                    className="form-control rounded-pill ps-5 bg-light border-0"
                    placeholder="Search users..."
                    value={searchUsers}
                    onChange={(e) => setSearchUsers(e.target.value)}
                  />
                  <Icon
                    icon="solar:magnifer-linear"
                    className="position-absolute text-muted"
                    style={{ top: "50%", left: "15px", transform: "translateY(-50%)" }}
                    width={18}
                  />
                </div>

                {usersLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-3 text-muted small">No users found.</div>
                ) : (
                  <div className="d-grid gap-2" style={{ maxHeight: 360, overflow: "auto" }}>
                    {filteredUsers.slice(0, 25).map((u) => (
                      <div key={u.id} className="d-flex align-items-center gap-2 p-2 border rounded-4">
                        <img
                          src={u.profilePicture || placeholderAvatar}
                          alt={u.name}
                          width="32"
                          height="32"
                          className="rounded-circle border"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold text-sm">{u.name}</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                            {u.country_code || ""} {u.phone || "-"}
                          </div>
                          <div className="d-flex gap-6 flex-wrap mt-1">
                            {u.isSubAdmin && (
                              <span className="badge bg-warning-subtle text-warning" style={{ fontSize: "0.65rem" }}>
                                SubAdmin
                              </span>
                            )}
                            {u.isCoordinator && (
                              <span className="badge bg-info-subtle text-info" style={{ fontSize: "0.65rem" }}>
                                Coordinator
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-primary rounded-pill"
                          disabled={
                            assignMutation.isPending ||
                            !!u.isSubAdmin ||
                            !!u.isCoordinator ||
                            (hasSubAdmin && !u.isSubAdmin)
                          }
                          onClick={() => assignMutation.mutate({ userId: u.id, role: "subadmin", enabled: true })}
                        >
                          {u.isSubAdmin ? "Assigned" : "Make SubAdmin"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {assignMutation.isError && (
                  <div className="alert alert-danger mb-0 py-2 mt-3">
                    {assignMutation.error?.response?.data?.message || "Failed to assign role"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <h5 className="mb-0 fw-bold d-flex align-items-center">
                  <Icon icon="solar:users-group-rounded-linear" className="me-2" width={22} />
                  SubAdmins
                </h5>
                <span className="badge bg-secondary-subtle text-secondary">
                  {rows.length} total
                </span>
              </div>

              <div className="card-body p-0">
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                ) : error ? (
                  <div className="text-center py-5 text-danger">
                    <Icon icon="solar:danger-triangle-linear" width={44} className="mb-2" />
                    <div>{error?.message || "Failed to load SubAdmins"}</div>
                  </div>
                ) : rows.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">No SubAdmins yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4">User</th>
                          <th>Phone</th>
                          <th>Created</th>
                          <th className="text-end pe-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((u) => (
                          <tr key={u.id}>
                            <td className="ps-4">
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={u.profilePicture || placeholderAvatar}
                                  alt={u.name}
                                  width="36"
                                  height="36"
                                  className="rounded-circle border"
                                  style={{ objectFit: "cover" }}
                                />
                                <div>
                                  <div className="fw-semibold">{u.name}</div>
                                  <span className="badge bg-warning-subtle text-warning" style={{ fontSize: "0.7rem" }}>
                                    SubAdmin
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="text-muted">
                              {u.country_code || ""} {u.phone || "-"}
                            </td>
                            <td className="text-muted">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                            </td>
                            <td className="text-end pe-4">
                              <button
                                className="btn btn-sm btn-outline-danger rounded-pill"
                                disabled={deactivateMutation.isPending}
                                onClick={() => deactivateMutation.mutate(u.id)}
                              >
                                Remove Role
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {deactivateMutation.isError && (
                  <div className="p-3">
                    <div className="alert alert-danger mb-0 py-2">
                      {deactivateMutation.error?.response?.data?.message || "Failed to deactivate role"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
