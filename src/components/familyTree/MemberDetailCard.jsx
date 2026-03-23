import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

import { useAuth } from "../../context/AuthContext";

const MemberDetailCard = ({ member, onViewProfile, onEdit, onAdd, onDelete, guardianId, onSetGuardian }) => {
  const { user } = useAuth();
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    // Initialize Bootstrap tooltip
    if (emailRef.current && window.bootstrap) {
      const tooltip = new window.bootstrap.Tooltip(emailRef.current);
      return () => {
        tooltip.dispose();
      };
    }
  }, [member.email]);

  if (!member) return null;

  // Permission check for adding members
  // Allow if user is admin/superadmin OR if the member card belongs to the current user
  const canAddMember = user?.isAdmin || user?.isSuperAdmin || user?.id === member.userId;

  // Permission check for adding/editing members
  // Allow if:
  // 1. User is Admin/SuperAdmin
  // 2. Member card belongs to the current user (Self)
  // 3. User is connected to the member (Partner, Parent, Child)
  const canEditMember = (() => {
    if (user?.isAdmin || user?.isSuperAdmin) return true;
    if (!user) return false;

    const currentUserId = user.id || user._id;

    // 1. Self
    if (member.userId === currentUserId) return true;

    // 2. Partner (I am their partner)
    if (member.partner?.userId === currentUserId) return true;

    // 3. Parent (I am their parent -> They list me as father or mother)
    if (member.father === currentUserId || member.mother === currentUserId) return true;

    // 4. Child (I am their child -> They list me in childrenIds)
    if (member.childrenIds && member.childrenIds.includes(currentUserId)) return true;

    return false;
  })();

  // Get gender-specific placeholder image
  const getPlaceholderImage = (gender) => {
    if (gender === 'male') {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    } else if (gender === 'female') {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135789.png";
    } else {
      return "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
    }
  };

  const getProfileImage = (profilePicture, gender) => {
    if (profilePicture && profilePicture.trim() !== '') {
      return profilePicture;
    }
    return getPlaceholderImage(gender);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="member-detail-card card shadow-sm h-100">
      <div className="card-body px-20 py-20">
        {/* Profile Picture */}
        <div className="text-center mb-20">
          <div
            className="profile-image-wrapper mx-auto"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid #e5e7eb',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <img
              src={getProfileImage(member.profilePicture, member.gender)}
              alt={`${member.firstname} ${member.lastname}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <h5 className="mt-16 mb-4 fw-bold text-neutral-900">
            {member.firstname} {member.lastname}
          </h5>
          <span
            className="badge text-capitalize"
            style={{
              backgroundColor: member.gender === 'male' ? '#e3f2fd' : member.gender === 'female' ? '#fce4ec' : '#f5f5f5',
              color: member.gender === 'male' ? '#2196f3' : member.gender === 'female' ? '#e91e63' : '#757575',
              fontSize: '12px',
              padding: '4px 12px'
            }}
          >
            {member.gender}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-center gap-4 mb-20">
          <div className="d-flex flex-column align-items-center gap-1">
            <button
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: '44px', height: '44px', backgroundColor: '#f3f4f6', border: 'none' }}
              onClick={() => onViewProfile && onViewProfile(member)}
              title="View Full Profile"
            >
              <Icon icon="solar:user-id-bold" style={{ fontSize: '22px', color: '#4b5563' }} />
            </button>
            <span className="text-xs fw-medium text-neutral-600">Profile</span>
          </div>

          {canEditMember && (
            <div className="d-flex flex-column align-items-center gap-1">
              <button
                className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '44px', backgroundColor: '#e3f2fd', border: 'none' }}
                onClick={() => onEdit && onEdit(member)}
                title="Edit Member"
              >
                <Icon icon="solar:pen-new-square-bold" style={{ fontSize: '22px', color: '#2196f3' }} />
              </button>
              <span className="text-xs fw-medium text-neutral-600">Edit</span>
            </div>
          )}

          {canAddMember && (
            <div className="d-flex flex-column align-items-center gap-1">
              <button
                className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '44px', backgroundColor: '#e8f5e9', border: 'none' }}
                onClick={() => onAdd && onAdd(member)}
                title="Add Member"
              >
                <Icon icon="solar:user-plus-bold" style={{ fontSize: '22px', color: '#4caf50' }} />
              </button>
              <span className="text-xs fw-medium text-neutral-600">Add</span>
            </div>
          )}

          {/* More Options - Only if actions available */}
          {((canAddMember && user?.id !== member.userId) || (user && user.id !== member.userId && onSetGuardian)) && (
            <div className="d-flex flex-column align-items-center gap-1 position-relative">
              <button
                className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '44px', backgroundColor: '#f5f5f5', border: 'none' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionsMenu(!showActionsMenu);
                }}
                title="More Options"
              >
                <Icon icon="mdi:dots-vertical" style={{ fontSize: '22px', color: '#616161' }} />
              </button>
              <span className="text-xs fw-medium text-neutral-600">More</span>

              {showActionsMenu && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    minWidth: '200px',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: '1px solid #eee'
                  }}
                >
                  {user && user.id !== member.userId && onSetGuardian && (
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      onClick={() => {
                        onSetGuardian(guardianId === member.userId ? null : member.userId);
                        setShowActionsMenu(false);
                      }}
                    >
                      <Icon
                        icon={guardianId === member.userId ? "solar:shield-cross-bold" : "solar:shield-check-bold"}
                        style={{ fontSize: '18px', color: guardianId === member.userId ? '#f44336' : '#3f51b5' }}
                      />
                      {guardianId === member.userId ? "Remove as Guardian" : "Set as Guardian"}
                    </button>
                  )}

                  {canAddMember && user?.id !== member.userId && (
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
                      onClick={() => {
                        if (onDelete) onDelete(member);
                        setShowActionsMenu(false);
                      }}
                    >
                      <Icon icon="solar:trash-bin-trash-bold" style={{ fontSize: '18px' }} />
                      Delete Member
                    </button>
                  )}
                </div>
              )}

              {/* Backdrop to close menu */}
              {showActionsMenu && (
                <div
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                  onClick={() => setShowActionsMenu(false)}
                />
              )}
            </div>
          )}
        </div>

        {/* Contact Details */}
        <div className="details-section">
          <div className="detail-item mb-16 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Icon
                icon="solar:phone-bold"
                style={{ fontSize: '18px', color: '#6b7280', marginRight: '10px' }}
              />
              <span className="text-sm fw-medium text-neutral-600">Phone</span>
            </div>
            <div className="text-sm text-neutral-900 fw-semibold">
              {member.phone || "N/A"}
            </div>
          </div>

          <div className="detail-item mb-16 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Icon
                icon="solar:letter-bold"
                style={{ fontSize: '18px', color: '#6b7280', marginRight: '10px' }}
              />
              <span className="text-sm fw-medium text-neutral-600">Email</span>
            </div>
            <div
              ref={emailRef}
              className="text-sm text-neutral-900 fw-semibold text-end"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={member.email || "N/A"}
              style={{
                maxWidth: '60%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {member.email || "N/A"}
            </div>
          </div>

          <div className="detail-item mb-16 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Icon
                icon="solar:calendar-bold"
                style={{ fontSize: '18px', color: '#6b7280', marginRight: '10px' }}
              />
              <span className="text-sm fw-medium text-neutral-600">Date of Birth</span>
            </div>
            <div className="text-sm text-neutral-900 fw-semibold">
              {formatDate(member.dob)}
            </div>
          </div>

          <div className="detail-item mb-16 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Icon
                icon="solar:user-id-bold"
                style={{ fontSize: '18px', color: '#6b7280', marginRight: '10px' }}
              />
              <span className="text-sm fw-medium text-neutral-600">Age</span>
            </div>
            <div className="text-sm text-neutral-900 fw-semibold">
              {member.age ? `${member.age} years` : "N/A"}
            </div>
          </div>
        </div>

        {/* Partner Section */}
        {
          member.partner && (
            <>
              <hr className="my-20" style={{ borderColor: '#e5e7eb' }} />
              <div className="partners-section">
                <h6 className="text-sm fw-semibold text-neutral-900 mb-12 d-flex align-items-center">
                  <Icon icon="solar:heart-bold" className="me-2" style={{ color: '#e91e63' }} />
                  Partner
                </h6>
                <div className="partners-list">
                  <div
                    className="d-flex align-items-center gap-12 p-12 mb-12 radius-8"
                    style={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div
                      className="partner-image"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #fff',
                        flexShrink: 0
                      }}
                    >
                      <img
                        src={getProfileImage(member.partner.profilePicture, member.partner.gender)}
                        alt={`${member.partner.fullName}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <div className="partner-info flex-grow-1">
                      <div className="text-sm fw-semibold text-neutral-900 mb-2">
                        {member.partner.fullName}
                      </div>
                      <div className="text-xs text-neutral-600 d-flex align-items-center">
                        <Icon icon="solar:calendar-minimalistic-outline" className="me-1" />
                        {formatDate(member.partner.dob)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
      </div >
    </div >
  );
};

export default MemberDetailCard;

