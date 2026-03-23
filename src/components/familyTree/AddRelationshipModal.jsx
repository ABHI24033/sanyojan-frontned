import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import './AddRelationshipModal.css';
import { useAuth } from '../../context/AuthContext';

const AddRelationshipModal = ({ show, onClose, member, onSelectRelationship, getMemberDetails, rootId }) => {
  if (!show) return null;

  const { user } = useAuth();

  const getBirthYear = () => {
    if (member.birthyear) return member.birthyear;
    if (member.dob) {
      const date = new Date(member.dob);
      return date.getFullYear();
    }
    return null;
  };

  // ... (helper functions omitted for brevity in replacement if unchanged, but I need to keep them if I replace a block containing them)
  // Actually, I am replacing from top of file? No, just the signature and the logic block.

  /* I will include the helper functions to be safe or use a block replacement further down */


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

  // Get dummy profile picture for relationship types
  const getRelationshipAvatar = (relationship) => {
    if (relationship === 'father' || relationship === 'brother' || relationship === 'son') {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    } else if (relationship === 'mother' || relationship === 'sister' || relationship === 'daughter') {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135789.png";
    } else if (relationship === 'partner') {
      // Use a unique avatar for partner (could be male or female)
      return "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
    }
    return "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
  };

  const [showParentRequiredPopup, setShowParentRequiredPopup] = React.useState(false);
  const [showPartnerRequiredPopup, setShowPartnerRequiredPopup] = React.useState(false);

  const handleRelationshipClick = (relationship, e) => {
    if (e) e.stopPropagation();

    // Validation for Brother/Sister: Must have both parents
    if (relationship === 'brother' || relationship === 'sister') {
      if (!hasFather || !hasMother) {
        setShowParentRequiredPopup(true);
        return;
      }
    }

    // Validation for Son/Daughter: Must have partner
    if (relationship === 'son' || relationship === 'daughter') {
      if (!(member.partner || hasImpliedPartner)) {
        setShowPartnerRequiredPopup(true);
        return;
      }
    }

    onSelectRelationship(relationship);
  };


  // --- Admin/Structure Restrictions Logic ---
  const memberId = member.userId || member.id;
  const realMember = (getMemberDetails && memberId) ? getMemberDetails(memberId) : member;

  // 1. Partner Node (In-Law): Has Partner + No Parents + Not Root
  const isRoot = realMember.treeId === (realMember.id || realMember.userId);
  const realHasFather = !!(realMember.father || realMember.relationships?.fatherId);
  const realHasMother = !!(realMember.mother || realMember.relationships?.motherId);
  const realHasPartner = !!(realMember.partner || realMember.relationships?.partnerId);

  const isPartnerNode = !isRoot && realHasPartner && !realHasFather && !realHasMother;

  // 2. Sister Node (Female Bloodline): Female + (Parents OR Siblings) + Not Root
  const isFemale = realMember.gender === 'female' || (!realMember.gender);
  const realHasSiblings = (realMember.relationships?.siblingIds?.length > 0) || (realMember.brothers?.length > 0) || (realMember.sisters?.length > 0);

  const isSisterNode = !isRoot && isFemale && (realHasFather || realHasMother || realHasSiblings);

  const canAddMember = member?.isAdmin || member?.isSuperAdmin || realMember?.isAdmin || realMember?.isSuperAdmin;
  const isLoggedInUser = user?.id === member?.userId;
  const isAdminUser = user?.isAdmin || user?.isSuperAdmin;

  const canEdit = isLoggedInUser || canAddMember || isAdminUser;

  // Determine permissions
  let permParents = canEdit && (isLoggedInUser || !isPartnerNode);
  let permSiblings = canEdit && (isLoggedInUser || !isPartnerNode);
  let permChildren = canEdit && (isLoggedInUser || !isPartnerNode);
  let permPartner = canEdit && (isLoggedInUser || (!isPartnerNode && !isSisterNode));

  // --- Advanced RBAC Override for Admins ---
  if (isAdminUser && rootId && getMemberDetails) {
    const root = getMemberDetails(rootId);
    if (root) {
      const mId = memberId;

      // Partner check (robust)
      const isPartner = root.relationships?.partnerId === mId || (root.partners && root.partners.some(p => p.userId === mId));

      // Sibling check
      const isSibling = (root.relationships?.siblingIds && root.relationships.siblingIds.includes(mId)) ||
        (root.siblings && root.siblings.some(s => s.userId === mId));
      const isBrother = isSibling && realMember.gender === 'male';
      const isSister = isSibling && realMember.gender === 'female';

      // Child check
      const isChild = (root.relationships?.childrenIds && root.relationships.childrenIds.includes(mId));
      const isSon = isChild && realMember.gender === 'male';
      const isDaughter = isChild && realMember.gender === 'female';

      // General Ancestor Check (Recursive)
      let isAncestor = false;
      let ancestorGender = null;

      if (rootId && mId && getMemberDetails) {
        const queue = [root];
        const visited = new Set();
        visited.add(root.userId || root.id);

        let iterations = 0;
        while (queue.length > 0 && iterations < 100) { // Safety break
          iterations++;
          const curr = queue.shift();

          // Check Parents
          const fId = curr.relationships?.fatherId || curr.father;
          const mIdRef = curr.relationships?.motherId || curr.mother; // Rename to avoid conflict with mId var

          // Check Father
          if (fId) {
            if (fId === mId) {
              isAncestor = true;
              ancestorGender = 'male';
              break;
            }
            if (!visited.has(fId)) {
              const fNode = getMemberDetails(fId);
              if (fNode) {
                visited.add(fId);
                queue.push(fNode);
              }
            }
          }

          // Check Mother
          if (mIdRef) {
            if (mIdRef === mId) {
              isAncestor = true;
              ancestorGender = 'female';
              break;
            }
            if (!visited.has(mIdRef)) {
              const mNode = getMemberDetails(mIdRef);
              if (mNode) {
                visited.add(mIdRef);
                queue.push(mNode);
              }
            }
          }
        }
      }

      let relativeRole = null;
      if (isAncestor) {
        // Determine if Strict Paternal Ancestor (Root -> Father -> Father ...)
        let isStrictlyPaternal = false;

        if (rootId && mId && getMemberDetails) {
          let currentTestNode = typeof root === 'object' ? root : getMemberDetails(rootId);
          let safetyCounter = 0;

          while (currentTestNode && safetyCounter < 50) {
            safetyCounter++;
            const fId = currentTestNode.relationships?.fatherId || currentTestNode.father;

            if (fId === mId) {
              isStrictlyPaternal = true;
              break;
            }

            if (fId) {
              currentTestNode = getMemberDetails(fId);
            } else {
              break;
            }
          }
        }

        relativeRole = isStrictlyPaternal ? 'father' : 'mother';
      }
      else if (isPartner) relativeRole = 'partner';
      else if (isBrother) relativeRole = 'brother';
      else if (isSister) relativeRole = 'sister';
      else if (isSon) relativeRole = 'son';
      else if (isDaughter) relativeRole = 'daughter';
      else {
        // In-Law Check
        const partnerOfId = realMember.partner || realMember.relationships?.partnerId;
        if (partnerOfId) {
          const partnerId = typeof partnerOfId === 'object' ? (partnerOfId.userId || partnerOfId.id) : partnerOfId;
          const partnerNode = getMemberDetails(partnerId);
          if (partnerNode) {
            // Check if partner is Sibling of Root
            const partnerIsSibling = root.relationships?.siblingIds?.includes(partnerId);
            // Check if partner is Child of Root
            const partnerIsChild = root.relationships?.childrenIds?.includes(partnerId);

            if (partnerIsSibling) {
              if (partnerNode.gender === 'male') relativeRole = 'brotherWife'; // Partner is Brother
              else relativeRole = 'sisterHusband'; // Partner is Sister
            } else if (partnerIsChild) {
              if (partnerNode.gender === 'male') relativeRole = 'sonWife'; // Partner is Son
              else relativeRole = 'daughterHusband'; // Partner is Daughter
            }
          }
        }
      }

      // Apply Rules based on Role
      if (relativeRole === 'father') {
        // 1. Enable all
        permParents = true; permSiblings = true; permPartner = true; permChildren = true;
      } else if (relativeRole === 'mother') {
        // 2. Only son/daughter
        permParents = false; permSiblings = false; permPartner = false; permChildren = true;
      } else if (relativeRole === 'partner') {
        // 3. Only son/daughter
        permParents = false; permSiblings = false; permPartner = false; permChildren = true;
      } else if (relativeRole === 'brother') {
        // 4. Wife, son, daughter (No siblings/parents)
        permParents = false; permSiblings = false; permPartner = true; permChildren = true;
      } else if (relativeRole === 'brotherWife') {
        // 5. Only son/daughter
        permParents = false; permSiblings = false; permPartner = false; permChildren = true;
      } else if (relativeRole === 'sister') {
        // 6. Husband, son, daughter
        permParents = false; permSiblings = false; permPartner = true; permChildren = true;
      } else if (relativeRole === 'sisterHusband') {
        // 7. Only son/daughter
        permParents = false; permSiblings = false; permPartner = false; permChildren = true;
      } else if (relativeRole === 'son') {
        // 8. Wife, brother, sister, son, daughter. (Siblings = brother/sister)
        permParents = false; permSiblings = true; permPartner = true; permChildren = true;
      } else if (relativeRole === 'sonWife') {
        // 9. Only son/daughter
        permParents = false; permSiblings = false; permPartner = false; permChildren = true;
      } else if (relativeRole === 'daughter') {
        // 10. Husband, brother, sister, son, daughter
        permParents = false; permSiblings = true; permPartner = true; permChildren = true;
      } else if (relativeRole === 'daughterHusband') {
        // 11. Only son/daughter
        permParents = false; permSiblings = false; permPartner = false; permChildren = true;
      } else {
        // Fallback for distant relatives (Grandson, Uncle, Cousins, Great Grandson etc.)
        // If not explicitly identified as one of the above roles (which cover immediate family + immediate in-laws)

        // We assume they are blood relatives if valid member and not flagged as partner node in previous logic (though partnerNode check above isn't robust for distant ones)
        // Better check: If they don't have a partner linked, allow adding one.

        // Ensure not adding partner to someone who shouldn't have one?
        // Admin should be powerful.

        // Logic: specific in-laws (brotherWife, sisterHusband etc.) already handled and restrict adding partner.
        // So if relativeRole is NULL here, it means it's likely a blood relative (or unhandled in-law).

        // We will default to: Enable Partner and Children.
        // Siblings/Parents - debatable, but usually fine for Admins to build the tree.
        // permParents = false;
        // permSiblings = true; // Maybe allow adding siblings too?
        permPartner = true;
        permChildren = true; // Enabled for all levels as requested
      }
    }
  }

  // Allow logged-in user to add their own relatives regardless of tree structure (e.g., partner node)
  const canAddParents = permParents;
  const canAddSiblings = permSiblings;
  const canAddChildren = permChildren;
  const canAddPartner = permPartner;

  // Check if father or mother exists - handle different data structures
  const hasFather = (() => {
    // Direct check
    if (member?.father) {
      if (typeof member.father === 'string') return true; // Just an ID
      if (typeof member.father === 'object' && member.father !== null) {
        // Check for userId, _id, id, or if the object has any keys (implies populated data)
        if (member.father.userId || member.father._id || member.father.id || Object.keys(member.father).length > 0) return true;
      }
    }

    // Indirect check: If mother exists and has partners, assume one is the father
    // First, get the mother's ID
    let motherId = null;
    if (member?.mother) {
      if (typeof member.mother === 'string') motherId = member.mother;
      else if (member.mother.userId) motherId = member.mother.userId;
      else if (member.mother._id) motherId = member.mother._id;
    }

    if (motherId && getMemberDetails) {
      const fullMother = getMemberDetails(motherId);
      if (fullMother && fullMother.partner) {
        return true;
      }
    } else if (member?.mother && typeof member.mother === 'object' && member.mother.partner) {
      // Fallback to existing object if getMemberDetails is not available or fails
      return true;
    }

    return false;
  })();

  const hasMother = (() => {
    // Direct check
    if (member?.mother) {
      if (typeof member.mother === 'string') return true; // Just an ID
      if (typeof member.mother === 'object' && member.mother !== null) {
        // Check for userId, _id, id, or if the object has any keys (implies populated data)
        if (member.mother.userId || member.mother._id || member.mother.id || Object.keys(member.mother).length > 0) return true;
      }
    }

    // Indirect check: If father exists and has partners, assume one is the mother
    // First, get the father's ID
    let fatherId = null;
    if (member?.father) {
      if (typeof member.father === 'string') fatherId = member.father;
      else if (member.father.userId) fatherId = member.father.userId;
      else if (member.father._id) fatherId = member.father._id;
    }

    if (fatherId && getMemberDetails) {
      const fullFather = getMemberDetails(fatherId);
      if (fullFather && fullFather.partner) {
        return true;
      }
    } else if (member?.father && typeof member.father === 'object' && member.father.partner) {
      // Fallback to existing object if getMemberDetails is not available or fails
      return true;
    }

    return false;
  })();

  const hasImpliedPartner = (() => {
    // Handle both nodeData (flat) and raw person object (nested in relationships)
    const childrenIds = member.childrenIds || member.relationships?.childrenIds || [];
    const memberId = member.userId || member.id;

    if (!childrenIds || childrenIds.length === 0 || !getMemberDetails) return false;

    // Check if any child has another parent defined
    return childrenIds.some(childId => {
      const child = getMemberDetails(childId);
      if (!child) return false;

      const childMotherId = child.relationships?.motherId || child.mother;
      const childFatherId = child.relationships?.fatherId || child.father;

      // If I am father (or male), check if child has mother
      if ((member.gender === 'male' || !member.gender) && childMotherId) {
        // Make sure the mother is not ME
        return childMotherId !== memberId;
      }

      // If I am mother (or female), check if child has father
      if ((member.gender === 'female' || !member.gender) && childFatherId) {
        return childFatherId !== memberId;
      }

      return false;
    });
  })();

  const showParents = true;

  const renderPopup = (show, onClose, title, message) => {
    if (!show) return null;
    return (
      <div
        className="add-relationship-modal-overlay"
        style={{ zIndex: 100000, backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <div
          className="add-relationship-modal-content"
          style={{
            maxWidth: '400px',
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            padding: '30px',
            position: 'relative' // Override class styling if needed
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h4 style={{ marginBottom: '15px', color: '#333' }}>{title}</h4>
          <p style={{ marginBottom: '25px', color: '#666', lineHeight: '1.5' }}>{message}</p>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 4px rgba(33, 150, 243, 0.3)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1976d2'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2196f3'}
          >
            Got it
          </button>
        </div>
      </div>
    );
  };


  const modalContent = (
    <div className="add-relationship-modal-overlay" onClick={(e) => {
      e.stopPropagation();
      onClose();
    }}>
      <div className="add-relationship-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="add-relationship-modal-close" onClick={onClose}>
          Close <Icon icon="mdi:close" style={{ fontSize: '20px', marginLeft: '8px' }} />
        </button>

        {/* Relationship Tree */}
        <div className="relationship-tree">
          {/* Top Row - Parents (conditional) */}
          {showParents && (
            <>
              <div className="relationship-row parents-row">
                <button
                  className={`relationship-card male-card ${hasFather || !canAddParents ? 'disabled' : ''}`}
                  onClick={(e) => !hasFather && canAddParents && handleRelationshipClick('father', e)}
                  disabled={hasFather || !canAddParents}
                  style={{
                    opacity: hasFather || !canAddParents ? 0.5 : 1,
                    cursor: hasFather || !canAddParents ? 'not-allowed' : 'pointer',
                    position: 'relative'
                  }}
                >
                  <div className="relationship-avatar">
                    <img
                      src={getRelationshipAvatar('father')}
                      alt="Father"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="relationship-label">Add father</div>
                  {hasFather && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ fontSize: '0.6rem' }}>
                      Exists
                    </span>
                  )}
                </button>

                <button
                  className={`relationship-card female-card ${hasMother || !canAddParents ? 'disabled' : ''}`}
                  onClick={(e) => !hasMother && canAddParents && handleRelationshipClick('mother', e)}
                  disabled={hasMother || !canAddParents}
                  style={{
                    opacity: hasMother || !canAddParents ? 0.5 : 1,
                    cursor: hasMother || !canAddParents ? 'not-allowed' : 'pointer',
                    position: 'relative'
                  }}
                >
                  <div className="relationship-avatar">
                    <img
                      src={getRelationshipAvatar('mother')}
                      alt="Mother"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="relationship-label">Add mother</div>
                  {hasMother && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ fontSize: '0.6rem' }}>
                      Exists
                    </span>
                  )}
                </button>
              </div>

              {/* Parent Connector Lines - Always T-Junction since both buttons are shown */}
              <div className="parent-connector-lines">
                <div className="parent-connector-top"></div>
                <div className="parent-connector-vertical"></div>
              </div>
            </>
          )}

          {/* Middle Row - Siblings, Current Person, Partner */}
          <div className="relationship-row middle-row">
            {/* Left - Siblings with bracket */}
            {/* Left - Siblings with bracket */}
            <div className="siblings-section">
              <div className="siblings-column">
                <button
                  className={`relationship-card male-card sibling-card ${!canAddSiblings ? 'disabled' : ''}`}
                  onClick={(e) => canAddSiblings && handleRelationshipClick('brother', e)}
                  disabled={!canAddSiblings}
                  style={{
                    opacity: !canAddSiblings ? 0.5 : 1,
                    cursor: !canAddSiblings ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div className="relationship-avatar">
                    <img
                      src={getRelationshipAvatar('brother')}
                      alt="Brother"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="relationship-label">Add brother</div>
                </button>

                <button
                  className={`relationship-card female-card sibling-card ${!canAddSiblings ? 'disabled' : ''}`}
                  onClick={(e) => canAddSiblings && handleRelationshipClick('sister', e)}
                  disabled={!canAddSiblings}
                  style={{
                    opacity: !canAddSiblings ? 0.5 : 1,
                    cursor: !canAddSiblings ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div className="relationship-avatar">
                    <img
                      src={getRelationshipAvatar('sister')}
                      alt="Sister"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="relationship-label">Add sister</div>
                </button>
              </div>

              {/* Sibling Connector Bracket */}
              <div className="sibling-connector-bracket"></div>
            </div>

            {/* Center - Current Person Card */}
            <div className="relationship-card current-person-card">
              <div className="current-person-content">
                <img
                  src={member.profilePicture || getDefaultProfilePicture()}
                  alt={member.fullName}
                  className="current-person-avatar"
                  onError={(e) => {
                    e.target.src = getDefaultProfilePicture();
                  }}
                />
                <div className="current-person-info">
                  <div className="current-person-name">
                    {member.fullName || `${member.firstname} ${member.lastname}`}
                  </div>
                  {getBirthYear() && (
                    <div className="current-person-birth">b. {getBirthYear()}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Partner */}
            {/* Right - Partner */}
            <button
              className={`relationship-card partner-card ${member.partner || hasImpliedPartner || !canAddPartner ? 'disabled' : ''}`}
              onClick={(e) => canAddPartner && !member.partner && !hasImpliedPartner && handleRelationshipClick('partner', e)}
              disabled={!canAddPartner || !!member.partner || hasImpliedPartner}
              style={{
                opacity: (!canAddPartner || member.partner || hasImpliedPartner) ? 0.5 : 1,
                cursor: (!canAddPartner || member.partner || hasImpliedPartner) ? 'not-allowed' : 'pointer',
                position: 'relative'
              }}
            >
              <div className="relationship-avatar">
                <img
                  src={getRelationshipAvatar('partner')}
                  alt="Partner"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <div className="relationship-text">
                <div className="relationship-label">Add partner</div>
                <div className="relationship-sublabel">Wife, ex-wife, partner, ...</div>
              </div>
              {(member.partner || hasImpliedPartner) && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style={{ fontSize: '0.6rem' }}>
                  Exists
                </span>
              )}
            </button>
          </div>

          {/* Children Connector Lines */}
          <div className="children-connector-lines">
            <div className="children-connector-vertical"></div>
            <div className="children-connector-bottom"></div>
          </div>

          {/* Bottom Row - Children */}
          <div className="relationship-row children-row">
            <button
              className={`relationship-card male-card ${!canAddChildren ? 'disabled' : ''}`}
              onClick={(e) => canAddChildren && handleRelationshipClick('son', e)}
              disabled={!canAddChildren}
              style={{
                opacity: !canAddChildren ? 0.5 : 1,
                cursor: !canAddChildren ? 'not-allowed' : 'pointer',
              }}
            >
              <div className="relationship-avatar">
                <img
                  src={getRelationshipAvatar('son')}
                  alt="Son"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <div className="relationship-label">Add son</div>
            </button>

            <button
              className={`relationship-card female-card ${!canAddChildren ? 'disabled' : ''}`}
              onClick={(e) => canAddChildren && handleRelationshipClick('daughter', e)}
              disabled={!canAddChildren}
              style={{
                opacity: !canAddChildren ? 0.5 : 1,
                cursor: !canAddChildren ? 'not-allowed' : 'pointer',
              }}
            >
              <div className="relationship-avatar">
                <img
                  src={getRelationshipAvatar('daughter')}
                  alt="Daughter"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <div className="relationship-label">Add daughter</div>
            </button>
          </div>
        </div>
      </div>

      {/* Alert Popups */}
      {renderPopup(
        showParentRequiredPopup,
        () => setShowParentRequiredPopup(false),
        "Parents Required",
        "To add a sibling (brother or sister), ensuring the family structure is correct, please add both a Father and a Mother to this person first."
      )}

      {renderPopup(
        showPartnerRequiredPopup,
        () => setShowPartnerRequiredPopup(false),
        "Partner Required",
        "To add a child (son or daughter), please add a Partner (Wife/Husband) to this person first."
      )}
    </div>
  );

  // Render modal using portal to body
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default AddRelationshipModal;
