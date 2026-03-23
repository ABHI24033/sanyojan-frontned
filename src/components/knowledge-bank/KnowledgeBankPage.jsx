import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Modal } from "react-bootstrap";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import { useMyKnowledgeBank } from "../../hooks/knowledge-bank/useKnowledgeBank";
import { useMyPersonalData as usePersonalDataHook } from "../../hooks/knowledge-bank/usePersonalData";
import KnowledgeDirectory from "./KnowledgeDirectory";
import KnowledgeViewer from "./KnowledgeViewer";
import PersonalDataForm from "./PersonalDataForm";
import CreateKnowledgeBankForm from "./CreateKnowledgeBankForm";

export default function KnowledgeBankPage() {
  const { user } = useAuth();
  const { data: knowledgeBanks = [], isLoading, error } = useMyKnowledgeBank();
  const { data: personalData = [], isLoading: isLoadingPersonal } = usePersonalDataHook();

  const [activeTab, setActiveTab] = useState("bank"); // 'bank', 'personal'
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("pdf"); // 'pdf', 'video', 'link'
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showKnowledgeBankModal, setShowKnowledgeBankModal] = useState(false);

  const handleSelect = (item, mode) => {
    setSelectedItem(item);
    setViewMode(mode);
  };

  const isReligionMissing = error?.response?.data?.message?.includes("Religion") || error?.message?.includes("Religion");

  return (
    <div className="container-fluid py-4 bg-light min-vh-80">
      <div className="row g-4 h-100">
        {/* LEFT SIDEBAR */}
        <div className="col-md-3 col-lg-3">
          <div className="card border-0 shadow-sm h-100 overflow-hidden">
            {/* TABS HEADER */}
            <div className="card-header bg-white border-bottom p-0">
              <div className="d-flex w-100">
                <button
                  className={`btn border-0 rounded-0 flex-grow-1 py-3 fw-bold transition-all ${activeTab === 'bank' ? 'text-primary border-bottom border-primary border-2 bg-light' : 'text-secondary'}`}
                  onClick={() => setActiveTab('bank')}
                >
                  {user?.religion} Rituals
                </button>
                {/* <button
                  className={`btn border-0 rounded-0 flex-grow-1 py-3 fw-bold transition-all ${activeTab === 'personal' ? 'text-primary border-bottom border-primary border-2 bg-light' : 'text-secondary'}`}
                  onClick={() => setActiveTab('personal')}
                >
                  My Library
                </button> */}
              </div>
            </div>

            {/* ADMIN ACTIONS OR ADD BUTTON */}
            <div className="card-header bg-white border-bottom py-2 d-flex justify-content-between align-items-center">
              {activeTab === 'bank' && user?.isSuperAdmin ? (
                <>
                  <Link to="/admin/knowledge-bank" className="btn btn-xs d-flex align-items-center btn-outline-primary rounded-pill">
                    <Icon icon="solar:settings-linear" className="me-1" />
                    Manage
                  </Link>
                  <button
                    onClick={() => setShowKnowledgeBankModal(true)}
                    className="btn btn-xs d-flex align-items-center btn-primary rounded-pill"
                  >
                    <Icon icon="solar:add-circle-linear" className="me-1" />
                    Add New
                  </button>
                </>
              ) : /* activeTab === 'personal' ? (
                <button
                  className="btn btn-xs d-flex align-items-center w-100 rounded-pill btn-primary"
                  onClick={() => setShowPersonalModal(true)}
                >
                  <Icon icon="solar:add-circle-linear" className="me-1" />
                  Add to Library
                </button>
              ) : */ <div className="py-2"></div>}
            </div>

            <div className="card-body p-0 overflow-hidden" style={{ height: 'calc(100vh - 180px)', minHeight: '600px' }}>
              {isReligionMissing ? (
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
              ) : (activeTab === 'bank' && knowledgeBanks.length === 0) || (activeTab === 'personal' && personalData.length === 0) ? (
                <div className="text-center py-5 h-100 d-flex flex-column align-items-center justify-content-center">
                  <Icon icon="solar:library-linear" width={48} className="mb-3 opacity-50" />
                  <p className="text-muted small mb-0">No items found.</p>
                </div>
              ) : (isLoading || isLoadingPersonal) ? (
                <div className="text-center py-5 h-100 d-flex align-items-center justify-content-center">
                  <div className="spinner-border text-primary" role="status"></div>
                  <span className="ms-2 fw-medium">Loading...</span>
                </div>
              ) : error && activeTab === 'bank' ? (
                <div className="text-danger small p-4 text-center">
                  <Icon icon="solar:danger-triangle-linear" className="mb-2" width={32} /><br />
                  Failed to load content.
                </div>
              ) : (
                <KnowledgeDirectory
                  knowledgeBanks={activeTab === 'bank' ? knowledgeBanks : personalData}
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

      {/* Personal Data Modal */}
      {/* Personal Data Modal */}
      {/* <Modal show={showPersonalModal} onHide={() => setShowPersonalModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Add to My Library</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <PersonalDataForm onSuccess={() => setShowPersonalModal(false)} />
        </Modal.Body>
      </Modal> */}

      {/* Knowledge Bank Modal */}
      {/* Knowledge Bank Modal */}
      {showKnowledgeBankModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-0 pb-0">
                  <h6 className="modal-title fw-bold d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                    {/* <Icon icon="solar:book-bookmark-bold-duotone" className="text-primary me-2" width={20} /> */}
                    Add Knowledge Bank Entry
                  </h6>
                  <button
                    type="button"
                    className="btn-close text-reset small"
                    onClick={() => setShowKnowledgeBankModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body pt-2">
                  <CreateKnowledgeBankForm onSuccess={() => setShowKnowledgeBankModal(false)} />
                </div>
              </div>
            </div>
          </div>
          {/* Backdrop is handled by the modal container background style above or we can add a separate backdrop div if needed, 
              but standard bootstrap often uses a separate backdrop. 
              Here I used the wrapper with rgba background as a simple React-way backdrop overlay. 
          */}
        </>
      )}
    </div>
  );
}

