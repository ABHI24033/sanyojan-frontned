import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import AddMemberModal from './AddMemberModal';
import AddRelationshipModal from './AddRelationshipModal';
import './FamilyTreeCard.css';

const FamilyTreeCard = ({ member, isSelected, onSelect, onAddMember, onEdit, onDelete, currentUser, showAddButton = true, showDeleteButton = false, onSetGuardian, isMenuOpen, onToggleMenu, getMemberDetails, rootId }) => {
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [showRelationshipModal, setShowRelationshipModal] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRelationship, setSelectedRelationship] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    // Use props if available, otherwise local state
    const effectiveShowMenu = isMenuOpen !== undefined ? isMenuOpen : showMenu;
    const handleToggleMenu = (e) => {
        e.stopPropagation();
        if (onToggleMenu) {
            onToggleMenu(!effectiveShowMenu);
        } else {
            setShowMenu(!effectiveShowMenu);
        }
    };

    // Permission check for editing
    const canEditMember = (() => {
        if (currentUser?.isAdmin || currentUser?.isSuperAdmin) return true;
        if (!currentUser) return false;

        const currentUserId = currentUser.id || currentUser._id;
        // 1. Self
        if (member.userId === currentUserId || member.id === currentUserId) return true;

        // 2. Partner
        if (member.partner?.userId === currentUserId || (member.relationships && member.relationships.partnerId === currentUserId)) return true;

        // 3. Parent (I am their parent -> They list me as father or mother)
        if (member.father === currentUserId || member.mother === currentUserId ||
            (member.relationships && (member.relationships.fatherId === currentUserId || member.relationships.motherId === currentUserId))) return true;

        // 4. Child (I am their child -> They list me in childrenIds)
        if (member.childrenIds && member.childrenIds.includes(currentUserId)) return true;
        if (member.relationships && member.relationships.childrenIds && member.relationships.childrenIds.includes(currentUserId)) return true;

        return false;
    })();

    // Extract birth year from dob or birthyear field
    const getBirthYear = () => {
        if (member.birthyear) return member.birthyear;
        if (member.dob) {
            const date = new Date(member.dob);
            return date.getFullYear();
        }
        return null;
    };

    // Get default profile picture based on gender
    const getDefaultProfilePicture = () => {
        const gender = member.gender || 'other';
        // Use gender-specific dummy profile pictures
        if (gender === 'male') {
            return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        } else if (gender === 'female') {
            return "https://cdn-icons-png.flaticon.com/512/3135/3135789.png";
        } else {
            return "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
        }
    };

    const getBorderColor = (gender, selected) => {
        if (selected) return '#06b6d4'; // Cyan for selected
        if (gender === 'male') return '#06b6d4'; // Cyan for males
        if (gender === 'female') return '#f472b6'; // Pink for females
        return '#d1d5db'; // Gray default
    };

    const handleAddClick = (e) => {
        e.stopPropagation();
        setShowRelationshipModal(true);
    };

    const handleSelectRelationship = (relationship) => {
        setSelectedRelationship(relationship);
        setModalOpen(true);
        setShowRelationshipModal(false);
    };

    const handleRelationshipClick = (relationship, e) => {
        if (e) e.stopPropagation();
        setSelectedRelationship(relationship);
        setModalOpen(true);
        setShowAddOptions(false);
    };

    const handleAddMember = async (memberData) => {
        await onAddMember({
            ...memberData,
            targetUserId: member.userId
        });
        setModalOpen(false);
        setSelectedRelationship(null);
    };

    const handleCardClick = () => {
        if (onSelect) {
            onSelect(member);
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(member);
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(member);
        }
    };

    return (
        <div className="family-tree-card-wrapper">
            {/* Main Card */}
            <div
                className={`family-tree-card ${isSelected ? 'selected' : ''}`}
                style={{
                    background: isSelected
                        ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)' // Unified Deep Blue for selection
                        : member.gender === 'male'
                            ? '#e3f2fd' // Light blue for male
                            : member.gender === 'female'
                                ? '#fce4ec' // Light pink for female
                                : '#ffffff', // White default
                    borderColor: isSelected
                        ? '#000051' // Very deep blue border for selection
                        : member.gender === 'male'
                            ? '#90caf9' // Blue border for male
                            : member.gender === 'female'
                                ? '#f48fb1' // Pink border for female
                                : '#e5e7eb',
                    color: isSelected ? '#ffffff' : 'inherit',
                    boxShadow: isSelected
                        ? '0 0 0 4px rgba(13, 71, 161, 0.4)' // Deep blue shadow for selection
                        : '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onClick={handleCardClick}
            >
                {/* Profile Picture */}
                <div className="profile-picture-container">
                    <img
                        src={member.profilePicture || getDefaultProfilePicture()}
                        alt={member.fullName}
                        className="profile-picture"
                        onError={(e) => {
                            // Fallback to default if image fails to load
                            e.target.src = getDefaultProfilePicture();
                        }}
                    />
                    {/* Guardian Badge */}
                    {member.isGuardian && (
                        <div
                            className="guardian-badge"
                            style={{
                                position: 'absolute',
                                top: '-6px',
                                left: '-6px',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: '#ffffff', // White background
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1), 0 0 0 2px #FFD700', // Gold border/ring
                                zIndex: 100,
                            }}
                            title="Guardian"
                        >
                            <Icon icon="solar:medal-ribbons-star-bold" style={{ fontSize: '23px', color: '#FFB300' }} />
                        </div>
                    )}
                    {/* Camera icon badge - bottom right */}
                    <div className="camera-badge">
                        <Icon
                            icon="mdi:camera"
                            style={{ fontSize: '10px', color: '#fff' }}
                        />
                    </div>
                    {/* Status indicator - top right (orange dot) */}
                    {member.hasStatus && (
                        <div className="status-badge"></div>
                    )}
                </div>

                {/* Name and Birth Info */}
                <div className="member-info">
                    <div className="member-name" style={{ color: isSelected ? '#ffffff' : undefined }}>
                        {member.fullName || `${member.firstname} ${member.lastname}`}
                    </div>
                    {getBirthYear() && (
                        <div className="member-birth" style={{ color: isSelected ? '#e0e0e0' : undefined }}>
                            b. {getBirthYear()}
                        </div>
                    )}
                </div>

                {/* Edit Icon */}
                {canEditMember && (
                    <button className="edit-icon-btn" onClick={handleEditClick} title="Edit User">
                        <Icon icon="mdi:pencil" style={{ fontSize: '14px' }} />
                    </button>
                )}

                {/* Delete Icon - Only if allowed */}
                {/* More Options Menu - Top Right */}
                {((showDeleteButton) || (onSetGuardian && currentUser && currentUser.id !== member.userId)) && (
                    <div
                        className="more-options-container"
                        style={{ position: 'absolute', top: '6px', right: '6px', zIndex: 101 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="more-options-btn"
                            onClick={handleToggleMenu}
                            style={{
                                background: 'rgba(255,255,255,0.8)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#616161',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Icon icon="mdi:dots-vertical" style={{ fontSize: '16px' }} />
                        </button>

                        {effectiveShowMenu && (
                            <div
                                className="options-dropdown"
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '4px',
                                    background: '#fff',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    padding: '4px 0',
                                    minWidth: '160px',
                                    zIndex: 9999,
                                    border: '1px solid #eee'
                                }}
                            >
                                {onSetGuardian && currentUser && currentUser.id !== member.userId && (
                                    <button
                                        className="dropdown-item"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: 'none',
                                            background: 'transparent',
                                            textAlign: 'left',
                                            fontSize: '13px',
                                            color: '#333',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            onSetGuardian(member.isGuardian ? null : member.userId);
                                            if (onToggleMenu) onToggleMenu(false);
                                            else setShowMenu(false);
                                        }}
                                    >
                                        <Icon
                                            icon={member.isGuardian ? "solar:shield-cross-bold" : "solar:shield-check-bold"}
                                            style={{ marginRight: '8px', color: member.isGuardian ? '#f44336' : '#3f51b5' }}
                                        />
                                        {member.isGuardian ? "Remove Guardian" : "Set as Guardian"}
                                    </button>
                                )}

                                {showDeleteButton && (
                                    <button
                                        className="dropdown-item"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: 'none',
                                            background: 'transparent',
                                            textAlign: 'left',
                                            fontSize: '13px',
                                            color: '#d32f2f',
                                            cursor: 'pointer',
                                            borderTop: (onSetGuardian && currentUser && currentUser.id !== member.userId) ? '1px solid #f5f5f5' : 'none'
                                        }}
                                        onClick={(e) => handleDeleteClick(e)}
                                    >
                                        <Icon icon="solar:trash-bin-trash-bold" style={{ marginRight: '8px' }} />
                                        Delete Member
                                    </button>
                                )}
                            </div>
                        )}
                        {/* Backdrop to close menu */}
                        {effectiveShowMenu && (
                            <div
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9998 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onToggleMenu) onToggleMenu(false);
                                    else setShowMenu(false);
                                }}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Add Button Below Card - Optional */}
            {
                showAddButton && (
                    <button
                        className="add-member-btn"
                        onClick={handleAddClick}
                    >
                        <Icon icon="mdi:plus" style={{ fontSize: '16px' }} />
                    </button>
                )
            }

            {/* Add Relationship Modal */}
            <AddRelationshipModal
                show={showRelationshipModal}
                onClose={() => setShowRelationshipModal(false)}
                member={member}
                onSelectRelationship={handleSelectRelationship}
                getMemberDetails={getMemberDetails}
                rootId={rootId}
            />

            {/* Add Member Form Modal */}
            <AddMemberModal
                show={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedRelationship(null);
                }}
                onAdd={handleAddMember}
                targetUserId={member.userId}
                relationship={selectedRelationship}
                targetMemberGender={member.gender}
                targetMemberName={`${member.firstname} ${member.lastname}`}
                targetMemberPartners={member.partners}
            />
        </div>
    );
};

export default FamilyTreeCard;
