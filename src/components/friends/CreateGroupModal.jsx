import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useFriends } from "../../hooks/friends/useFriends";
import { useGroups } from "../../hooks/friends/useGroups";
import { useQuery } from "@tanstack/react-query";
import { getFamilyTree } from "../../api/familyTree";
import Input from "../common/Input";

export default function CreateGroupModal({ show, onClose }) {
    const { createGroup, isCreating } = useGroups();
    const { contacts, isLoading: loadingContacts } = useFriends(show);

    // Fetch family tree when modal is shown
    const familyQuery = useQuery({
        queryKey: ["family-tree-members"],
        queryFn: getFamilyTree,
        enabled: show,
    });

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]); // { memberId, memberType, name }

    const familyMembers = familyQuery.data?.data?.people || [];
    const externalContacts = contacts || [];

    // Filtered lists
    const filteredFamily = useMemo(() =>
        familyMembers.filter(m =>
            `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        ), [familyMembers, searchTerm]);

    const filteredContacts = useMemo(() =>
        externalContacts.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [externalContacts, searchTerm]);

    const toggleMember = (id, type, memberName) => {
        setSelectedMembers(prev => {
            const exists = prev.find(m => m.memberId === id && m.memberType === type);
            if (exists) {
                return prev.filter(m => !(m.memberId === id && m.memberType === type));
            } else {
                return [...prev, { memberId: id, memberType: type, name: memberName }];
            }
        });
    };

    const handleSave = async () => {
        if (!name.trim()) return;
        if (selectedMembers.length === 0) return;

        try {
            await createGroup({
                name,
                description,
                members: selectedMembers.map(({ memberId, memberType }) => ({ memberId, memberType }))
            });
            setName("");
            setDescription("");
            setSelectedMembers([]);
            setSearchTerm("");
            onClose();
        } catch (error) {
            console.error("Save Group Error:", error);
        }
    };

    if (!show) return null;

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.5)", zIndex: 1060, backdropFilter: "blur(4px)" }}>
            <div className="bg-white rounded-4 shadow-lg overflow-hidden" style={{ width: "600px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

                {/* Header */}
                <div className="p-20 border-bottom d-flex justify-content-between align-items-center bg-light">
                    <h5 className="mb-0 fw-bold d-flex align-items-center">
                        <Icon icon="solar:users-group-rounded-linear" className="me-2 text-primary fs-4" />
                        Create New Group
                    </h5>
                    <button className="btn border-0 p-0" onClick={onClose}>
                        <Icon icon="mdi:close" className="fs-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-24 overflow-auto flex-grow-1">
                    <div className="mb-4">
                        <Input
                            label="Group Name"
                            placeholder="e.g. Close Friends, Mumbai Relatives"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold mb-2">Description (Optional)</label>
                        <textarea
                            className="form-control border-gray-200 rounded-3"
                            rows="2"
                            placeholder="What is this group for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ resize: "none" }}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold mb-2">Select Members ({selectedMembers.length} selected)</label>
                        <div className="position-relative mb-3">
                            <Icon icon="mdi:magnify" className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="form-control ps-5 rounded-pill border-gray-200"
                                placeholder="Search family or friends..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Selected Pills */}
                        {selectedMembers.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {selectedMembers.map(m => (
                                    <span key={`${m.memberType}-${m.memberId}`} className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill py-2 px-3 d-flex align-items-center">
                                        {m.name}
                                        <Icon
                                            icon="mdi:close"
                                            className="ms-2 cursor-pointer"
                                            onClick={() => toggleMember(m.memberId, m.memberType)}
                                        />
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Member Lists */}
                        <div className="border rounded-3 overflow-hidden">
                            <div className="max-h-300 overflow-auto">

                                {/* Family Members Section */}
                                <div className="bg-light px-3 py-2 border-bottom">
                                    <small className="fw-bold text-uppercase text-muted" style={{ fontSize: "10px", letterSpacing: "1px" }}>Family Members</small>
                                </div>
                                {loadingContacts || familyQuery.isLoading ? (
                                    <div className="p-3 text-center text-muted">Loading...</div>
                                ) : filteredFamily.length === 0 ? (
                                    <div className="p-3 text-center text-muted small">No family members found</div>
                                ) : (
                                    filteredFamily.map(m => {
                                        const fullName = `${m.firstName} ${m.lastName}`;
                                        const isSelected = selectedMembers.some(sm => sm.memberId === m.id && sm.memberType === "User");
                                        return (
                                            <div
                                                key={m.id}
                                                className={`p-12 d-flex align-items-center gap-3 border-bottom cursor-pointer transition-all ${isSelected ? 'bg-primary-subtle' : 'hover-bg-light'}`}
                                                onClick={() => toggleMember(m.id, "User", fullName)}
                                            >
                                                <div className="form-check m-0">
                                                    <input className="form-check-input" type="checkbox" checked={isSelected} readOnly />
                                                </div>
                                                <img src={m.profilePicture || "/assets/images/avatar/user.png"} alt="" className="rounded-circle border" width="36" height="36" style={{ objectFit: "cover" }} />
                                                <div>
                                                    <p className="mb-0 fw-medium small text-dark">{fullName}</p>
                                                    <small className="text-muted" style={{ fontSize: "11px" }}>Family Member</small>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}

                                {/* External Contacts Section */}
                                <div className="bg-light px-3 py-2 border-bottom mt-2">
                                    <small className="fw-bold text-uppercase text-muted" style={{ fontSize: "10px", letterSpacing: "1px" }}>Friends & Relatives</small>
                                </div>
                                {filteredContacts.length === 0 ? (
                                    <div className="p-3 text-center text-muted small">No external contacts found</div>
                                ) : (
                                    filteredContacts.map(c => {
                                        const isSelected = selectedMembers.some(sm => sm.memberId === c._id && sm.memberType === "ExternalContact");
                                        return (
                                            <div
                                                key={c._id}
                                                className={`p-12 d-flex align-items-center gap-3 border-bottom cursor-pointer transition-all ${isSelected ? 'bg-primary-subtle' : 'hover-bg-light'}`}
                                                onClick={() => toggleMember(c._id, "ExternalContact", c.name)}
                                            >
                                                <div className="form-check m-0">
                                                    <input className="form-check-input" type="checkbox" checked={isSelected} readOnly />
                                                </div>
                                                <div className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center border" width="36" height="36" style={{ width: "36px", height: "36px" }}>
                                                    <Icon icon="mdi:account" className="text-secondary" />
                                                </div>
                                                <div>
                                                    <p className="mb-0 fw-medium small text-dark">{c.name}</p>
                                                    <small className="text-muted" style={{ fontSize: "11px" }}>{c.relation || "Contact"}</small>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-20 bg-light border-top d-flex gap-3 justify-content-end">
                    <button className="btn btn-outline-secondary px-4 fw-medium" onClick={onClose} disabled={isCreating}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary px-4 fw-medium d-flex align-items-center"
                        onClick={handleSave}
                        disabled={isCreating || !name.trim() || selectedMembers.length === 0}
                    >
                        {isCreating && <Icon icon="mdi:loading" className="mdi-spin me-2" />}
                        Create Group
                    </button>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-bg-light:hover { background-color: #f8f9fa; }
                .max-h-300 { max-height: 300px; }
            ` }} />
        </div>
    );
}
