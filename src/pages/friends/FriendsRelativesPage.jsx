import React, { useState } from "react";
import AddContactForm from "../../components/friends/AddContactForm";
import ContactList from "../../components/friends/ContactList";
import GroupList from "../../components/friends/GroupList";
import CreateGroupModal from "../../components/friends/CreateGroupModal";
import { Icon } from "@iconify/react";
import MasterLayout from "../../masterLayout/MasterLayout";

const FriendsRelativesPage = () => {
    const [activeTab, setActiveTab] = useState("contacts"); // "contacts" or "groups"
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <MasterLayout>
            <div className="container py-4 py-md-5">
                <div className="row justify-content-center">
                    <div className="col-12">
                        {/* Header */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                            <div className="card-body p-0">
                                <div className="p-24 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary-subtle p-3 rounded-circle me-3 text-primary d-none d-sm-block">
                                            <Icon icon="solar:users-group-rounded-bold-duotone" width={32} />
                                        </div>
                                        <div>
                                            <h4 className="mb-0 fw-bold fs-3">Friends & Relatives</h4>
                                            <p className="text-muted mb-0 small">Manage your external contacts and groups for event invitations.</p>
                                        </div>
                                    </div>

                                    {activeTab === "groups" && (
                                        <button
                                            className="btn btn-primary px-4 py-12 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                                            onClick={() => setShowCreateModal(true)}
                                        >
                                            <Icon icon="mdi:plus" className="fs-5" />
                                            Create New Group
                                        </button>
                                    )}
                                </div>

                                {/* Tabs Navigation */}
                                <div className="px-24 border-top">
                                    <div className="d-flex gap-4">
                                        <button
                                            className={`btn py-12 px-2 border-0 position-relative transition-all fw-semibold ${activeTab === "contacts" ? "text-primary" : "text-muted"}`}
                                            onClick={() => setActiveTab("contacts")}
                                            style={{ background: "transparent" }}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <Icon icon="mdi:account-details-outline" className="fs-5" />
                                                Contacts
                                            </div>
                                            {activeTab === "contacts" && (
                                                <div className="position-absolute bottom-0 start-0 w-100 bg-primary" style={{ height: "3px", borderRadius: "3px 3px 0 0" }} />
                                            )}
                                        </button>
                                        <button
                                            className={`btn py-12 px-2 border-0 position-relative transition-all fw-semibold ${activeTab === "groups" ? "text-primary" : "text-muted"}`}
                                            onClick={() => setActiveTab("groups")}
                                            style={{ background: "transparent" }}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <Icon icon="solar:users-group-two-rounded-linear" className="fs-5" />
                                                Groups
                                            </div>
                                            {activeTab === "groups" && (
                                                <div className="position-absolute bottom-0 start-0 w-100 bg-primary" style={{ height: "3px", borderRadius: "3px 3px 0 0" }} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        {activeTab === "contacts" ? (
                            <div className="row g-4 animation-fade-in">
                                {/* Form Column */}
                                <div className="col-lg-5 col-xl-4">
                                    <AddContactForm />
                                </div>

                                {/* List Column */}
                                <div className="col-lg-7 col-xl-8">
                                    <div className="card border-0 shadow-sm rounded-4 h-100">
                                        <div className="card-header bg-white border-bottom p-20">
                                            <h6 className="fw-bold mb-0 fs-4 text-primary d-flex align-items-center">
                                                <Icon icon="mdi:account-group" className="me-2 text-primary fs-5" />
                                                My Connections
                                            </h6>
                                        </div>
                                        <div className="card-body p-20 bg-light-subtle rounded-bottom-4 custom-scrollbar" style={{ maxHeight: "600px", overflowY: "auto" }}>
                                            <ContactList />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animation-fade-in">
                                <GroupList />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateGroupModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                .animation-fade-in {
                    animation: fadeIn 0.3s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .bg-light-subtle { background-color: #fcfcfd; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d0d0d0; }
            ` }} />
        </MasterLayout>
    );
};

export default FriendsRelativesPage;
