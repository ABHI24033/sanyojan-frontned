import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import { useMyRituals } from "../../hooks/knowledge-bank/useRituals";
import KnowledgeDirectory from "./KnowledgeDirectory";
import KnowledgeViewer from "./KnowledgeViewer";

export default function KnowledgeBankPage() {
  const { user } = useAuth();
  const { data: rituals = [], isLoading, error } = useMyRituals();


  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("pdf"); // 'pdf', 'video', 'link'

  const handleSelect = (item, mode) => {
    setSelectedItem(item);
    setViewMode(mode);
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-80">
      <div className="row g-4 h-100">
        {/* LEFT SIDEBAR */}
        <div className="col-md-3 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            {user?.isSuperAdmin && (
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <Link to="/admin/knowledge-bank" className="btn btn-sm btn-outline-primary rounded-pill">
                  <Icon icon="solar:settings-linear" className="me-1" />
                  Manage
                </Link>
                <Link to="/create-knowledge-bank" className="btn btn-sm btn-primary rounded-pill">
                  <Icon icon="solar:add-circle-linear" className="me-1" />
                  Add
                </Link>
              </div>
            )}
            <div className="card-body p-0 overflow-hidden" style={{ height: 'calc(100vh - 150px)', minHeight: '600px' }}>
              {isLoading ? (
                <div className="text-center py-5 h-100 d-flex align-items-center justify-content-center">
                  <div className="spinner-border text-primary" role="status"></div>
                  <span className="ms-2 fw-medium">Loading Library...</span>
                </div>
              ) : (Array.isArray(rituals) && rituals.length === 0) || rituals?.success === false ? (
                <div className="text-center p-4 h-100 d-flex flex-column align-items-center justify-content-center">
                  <Icon icon="solar:info-circle-linear" className="text-warning mb-3" width={48} />
                  <h6 className="fw-bold mb-2">Religion Not Specified</h6>
                  <p className="text-muted small mb-3 text-center" style={{ maxWidth: '250px' }}>
                    Fail to load rituals as religion is not specified in profile.
                    <br />
                    Please add your religion in update profile to see your rituals.
                  </p>
                  <Link
                    to={`/profile/edit-profile?userId=${user?._id}`}
                    className="btn btn-sm btn-primary rounded-pill px-5 mt-2"
                  >
                    Update Profile
                  </Link>
                </div>
              ) : error ? (
                <div className="text-danger small p-4 text-center">
                  <Icon icon="solar:danger-triangle-linear" className="mb-2" width={32} /><br />
                  Failed to load rituals.
                </div>
              ) : (
                <KnowledgeDirectory
                  rituals={rituals}
                  onSelect={handleSelect}
                  selectedId={selectedItem?._id}
                  selectedMode={viewMode}
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT VIEWER */}
        <div className="col-md-9 col-lg-9">
          <KnowledgeViewer
            item={selectedItem}
            viewMode={viewMode}
            onModeChange={setViewMode}
          />
        </div>
      </div>
    </div>
  );
}

