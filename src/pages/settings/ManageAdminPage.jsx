import React from "react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import MasterLayout from "../../masterLayout/MasterLayout";
import { getAdministrators } from "../../api/roles";

const placeholderAvatar =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

export default function ManageAdminPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["administrators"],
    queryFn: getAdministrators,
    staleTime: 60 * 1000,
  });

  const admin = data?.data?.admin || null;

  return (
    <MasterLayout>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div>
                  <h4 className="mb-0 fw-bold fs-5 d-flex align-items-center text-primary">
                    <Icon icon="solar:shield-user-bold-duotone" className="me-2" width={28} />
                    Manage Admin
                  </h4>
                  <p className="text-muted small mb-0 mt-1">
                    The first registered user of the system is the main Admin.
                  </p>
                </div>
              </div>

              <div className="card-body">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                ) : error ? (
                  <div className="text-center py-4 text-danger">
                    <Icon icon="solar:danger-triangle-linear" width={40} className="mb-2" />
                    <div>{error?.message || "Failed to load admin"}</div>
                  </div>
                ) : !admin ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No Admin found yet.</p>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-light">
                    <img
                      src={admin.profilePicture || placeholderAvatar}
                      alt={admin.name}
                      width="56"
                      height="56"
                      className="rounded-circle border"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <h6 className="mb-0 fw-semibold">{admin.name}</h6>
                        <span className="badge bg-warning-subtle text-warning" style={{ fontSize: "0.75rem" }}>
                          Main Admin
                        </span>
                      </div>
                      <div className="text-muted small mt-1">
                        {admin.country_code || ""} {admin.phone || ""}
                      </div>
                    </div>
                    <div className="text-muted small">
                      Created{" "}
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "-"}
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

