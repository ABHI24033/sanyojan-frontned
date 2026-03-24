import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFamilyTree, addFamilyMember, updateFamilyMember, getFamilyTreeStats, deleteFamilyMember, setGuardian } from "../../api/familyTree";
import FamilyTreeView from "../../components/familyTree/FamilyTreeView";
import EditMemberModal from "../../components/familyTree/EditMemberModal";
import AddMemberModal from "../../components/familyTree/AddMemberModal";
import DeleteMemberModal from "../../components/familyTree/DeleteMemberModal";
import AddRelationshipModal from "../../components/familyTree/AddRelationshipModal";
import Breadcrumb from "../../components/common/Breadcrumb";
import MasterLayout from "../../masterLayout/MasterLayout";
import AlertBox from "../../components/ui/Alert";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext";

const FamilyTreePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [treeData, setTreeData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // State for Add Member flow from Detail Card
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [targetMemberForAdd, setTargetMemberForAdd] = useState(null);
  const [selectedRelationship, setSelectedRelationship] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [highlightedMemberId, setHighlightedMemberId] = useState(null);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0 && treeData?.people) {
      const results = treeData.people.filter(person => {
        const fName = person.firstName || person.firstname || person.fullName?.split(' ')[0] || "";
        const lName = person.lastName || person.lastname || person.fullName?.split(' ')[1] || "";
        const fullName = `${fName} ${lName}`.toLowerCase();

        // Education check
        const educationMatch = person.education?.some(edu =>
          (edu.institution?.toLowerCase().includes(query.toLowerCase())) ||
          (edu.level?.toLowerCase().includes(query.toLowerCase()))
        );

        return fullName.includes(query.toLowerCase()) || educationMatch;
      });
      setSearchResults(results.slice(0, 8)); // Slightly more results
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleNodeClick = (member) => {
    navigate('/profile?userId=' + (member.userId || member.id));
  };

  const handleSelectSearchResult = (member) => {
    setHighlightedMemberId(member.id);

    // Removed immediate navigation to allow user to see the highlight in the tree
    setSearchQuery(""); // Clear search after selection
    setShowSearchResults(false);
  };

  const loadFamilyTree = async () => {
    try {
      setLoading(true);
      setError(null);
      const [treeResponse, statsResponse] = await Promise.all([
        getFamilyTree(),
        getFamilyTreeStats()
      ]);
      setTreeData(treeResponse.data);
      setStats(statsResponse.data);

    } catch (err) {
      console.error("Error loading family tree:", err);
      setError(err.message || "Failed to load family tree");
      setAlert({ type: "danger", message: err.message || "Failed to load family tree" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilyTree();
  }, []);

  const handleAddMember = async (memberData) => {
    try {
      const response = await addFamilyMember(memberData);

      if (response.exists) {
        setAlert({ type: "success", message: response.message });
        // Redirect to complete profile for this specific user
        setTimeout(() => {
          navigate(`/complete-profile?userId=${response.data.id}`);
        }, 1500);
        return;
      }
      
      // Re-load the tree to get the updated structure
      await loadFamilyTree();

      setAlert({ type: "success", message: response.message || "Family member added successfully" });

      // Reload stats
      const statsResponse = await getFamilyTreeStats();
      setStats(statsResponse.data);
      return response;

    } catch (err) {
      console.error("Error adding family member:", err);
      setAlert({ type: "danger", message: err.message || "Failed to add family member" });
      return null;
    }
  };

  const handleEditMember = (memberData) => {
    setSelectedMember(memberData);
    setEditModalOpen(true);
  };

  const handleUpdateMember = async (memberId, memberData) => {
    try {
      const response = await updateFamilyMember(memberId, memberData);
      setAlert({ type: "success", message: response.message || "Family member updated successfully" });

      // Reload tree and stats
      const [treeResponse, statsResponse] = await Promise.all([
        getFamilyTree(),
        getFamilyTreeStats()
      ]);
      setTreeData(treeResponse.data);
      setStats(statsResponse.data);

      setEditModalOpen(false);
      setSelectedMember(null);
      return response;
    } catch (err) {
      console.error("Error updating family member:", err);
      setAlert({ type: "danger", message: err.message || "Failed to update family member" });
      return null;
      throw err; // Re-throw to let modal handle it
    }
  };

  const handleViewProfile = (member) => {
    // navigate('/view-profile', { state: { member } });
    navigate('/profile?userId=' + member.userId);
  };

  const handleAddRelative = (member) => {
    setTargetMemberForAdd(member);
    setShowRelationshipModal(true);
  };

  const handleSelectRelationship = (relationship) => {
    setSelectedRelationship(relationship);
    setShowRelationshipModal(false);
    setShowAddMemberModal(true);
  };

  const handleSaveNewMember = async (memberData) => {
    try {
      const response = await handleAddMember(memberData);
      console.log("response", response);
      if (response) {
        setShowAddMemberModal(false);
        setTargetMemberForAdd(null);
        setSelectedRelationship(null);
      }
    } catch (err) {
      // Error is handled in handleAddMember, but we might want to keep modal open?
      // handleAddMember re-throws, so we catch it here.
      console.error("Failed to save new member:", err);
      // We don't close the modal if error occurs, so user can retry
    }
  };

  const onClickDeleteMember = (member) => {
    if (!member) return;
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      await deleteFamilyMember(memberToDelete.userId);
      setAlert({ type: "success", message: "Member deleted successfully" });

      // Reload tree
      loadFamilyTree();
      setShowDeleteModal(false);
      setMemberToDelete(null);

    } catch (err) {
      console.error("Error deleting member:", err);
      setAlert({ type: "danger", message: err.message || "Failed to delete member" });
      setShowDeleteModal(false);
    }
  };

  const handleSetGuardian = async (guardianId) => {
    try {
      const response = await setGuardian(guardianId);
      setAlert({ type: "success", message: response.message || "Guardian updated successfully" });
      await loadFamilyTree();
    } catch (err) {
      console.error("Error setting guardian:", err);
      setAlert({ type: "danger", message: err.message || "Failed to set guardian" });
    }
  };

  return (
    <MasterLayout>
      <AlertBox alert={alert} setAlert={setAlert} />
      {/* <Breadcrumb title="Family Tree" /> */}
      <div className="family-tree-page">
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px'
          }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error && !treeData ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            padding: '20px'
          }}>
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <button className="btn btn-primary mt-3" onClick={loadFamilyTree}>
              Retry
            </button>
          </div>
        ) : (
          <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Sticky Header Section with Search and Stats */}
            <div className="sticky-top pt-4 pb-2" style={{
              backgroundColor: '#f8f9fa',
              top: '-24px', // Adjust based on layout padding
              zIndex: 1020,
              margin: '-24px -24px 0 -24px',
              padding: '24px 24px 0 24px'
            }}>
              <div className="row mb-4 justify-content-end">
                <div className="col-md-6 col-lg-5">
                  {/* Search Bar - More Attractive (Kept from redesign) */}
                  <div className="position-relative mb-2">
                    <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border-0" style={{ backgroundColor: '#fff', padding: '0px 12px', }}>
                      <span className="input-group-text bg-white border-0 ps-4">
                        <Icon icon="solar:magnifer-linear" className="text-secondary" fontSize={24} />
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 bg-white shadow-none ps-2"
                        placeholder="Search family member..."
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{ fontSize: '1rem' }}
                        onFocus={() => {
                          if (searchQuery.length > 0) setShowSearchResults(true);
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowSearchResults(false), 200);
                        }}
                      />
                      {searchQuery && (
                        <button className="btn bg-white border-0 pe-4 text-muted" onClick={() => { setSearchQuery(''); setSearchResults([]); }}>
                          <Icon icon="solar:close-circle-bold" />
                        </button>
                      )}
                    </div>

                    {/* Search Results Dropdown - Premium Design */}
                    {showSearchResults && (
                      <div
                        className="position-absolute w-100 shadow-lg border border-light mt-2 rounded-4 overflow-hidden"
                        style={{
                          zIndex: 1000,
                          maxHeight: '400px',
                          overflowY: 'auto',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }}
                      >
                        {searchResults.length > 0 ? (
                          <div className="py-2">
                            <div className="px-3 py-2 text-muted small fw-bold text-uppercase border-bottom border-light mb-1">
                              Search Results ({searchResults.length})
                            </div>
                            <ul className="list-group p-2 list-group-flush">
                              {searchResults.map(member => {
                                const fName = member.firstName || member.firstname || "";
                                const lName = member.lastName || member.lastname || "";
                                const genderColor = member.gender === 'female' ? '#e91e63' : '#2196f3';

                                return (
                                  <li
                                    key={member.id}
                                    className="list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 py-6 px-3 mb-1 transition-all rounded"
                                    onMouseDown={(e) => {
                                      e.preventDefault(); // Prevent input onBlur from firing immediately
                                      handleSelectSearchResult(member);
                                    }}
                                    style={{
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <div className="position-relative">
                                      {member.profilePicture ? (
                                        <img src={member.profilePicture} alt="" className="rounded-circle shadow-sm" style={{ width: 36, height: 36, objectFit: 'cover', border: '1,5px solid #fff' }} />
                                      ) : (
                                        <div
                                          className="rounded-circle d-flex align-items-center justify-content-center border"
                                          style={{ width: 36, height: 36, backgroundColor: member.gender === 'female' ? '#fdeff2' : '#eef6fd' }}
                                        >
                                          <Icon icon="solar:user-bold" style={{ color: genderColor }} fontSize={18} />
                                        </div>
                                      )}
                                      <div
                                        className="position-absolute bottom-0 end-0 rounded-circle border border-white"
                                        style={{ width: 10, height: 10, backgroundColor: genderColor }}
                                      ></div>
                                    </div>
                                    <div className="flex-grow-1 min-w-0">
                                      <div className="d-flex align-items-center gap-2">
                                        <h6 className="mb-0 fw-bold fs-6 text-dark text-truncate">{fName} {lName}</h6>
                                        {member.prefix === 'Late' && (
                                          <span className="badge bg-secondary-subtle text-secondary small px-2 rounded-pill" style={{ fontSize: '9px' }}>Late</span>
                                        )}
                                      </div>
                                      <div className="d-flex align-items-center gap-2 mt-0">
                                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{member.age || 'N/A'} yrs</span>
                                        <span className="text-muted" style={{ fontSize: '8px' }}>•</span>
                                        <span className="text-muted text-capitalize" style={{ fontSize: '0.75rem' }}>{member.gender}</span>
                                      </div>
                                    </div>
                                    <div className="text-muted opacity-50">
                                      <Icon icon="solar:alt-arrow-right-linear" fontSize={16} />
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : searchQuery.length > 0 && (
                          <div className="p-5 text-center text-muted">
                            <Icon icon="solar:magnifer-zoom-out-linear" fontSize={48} className="mb-3 opacity-25" />
                            <p className="mb-0">No family members found for <strong>"{searchQuery}"</strong></p>
                            <small>Try a different name</small>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Stats Section */}
              {stats && (
                <div className="d-flex flex-wrap gap-3 mb-4 px-2">
                  <div className="d-flex align-items-center bg-white shadow-sm rounded-pill px-3 py-2 border border-light">
                    <Icon icon="solar:users-group-rounded-bold" className="text-primary me-2" fontSize={20} />
                    <span className="small fw-bold text-dark">{stats.totalMembers} Members</span>
                  </div>
                  <div className="d-flex align-items-center bg-white shadow-sm rounded-pill px-3 py-2 border border-light">
                    <Icon icon="solar:user-bold" style={{ color: '#2196f3' }} className="me-2" fontSize={20} />
                    <span className="small fw-bold text-dark">{stats.males} Males</span>
                  </div>
                  <div className="d-flex align-items-center bg-white shadow-sm rounded-pill px-3 py-2 border border-light">
                    <Icon icon="solar:user-bold" style={{ color: '#e91e63' }} className="me-2" fontSize={20} />
                    <span className="small fw-bold text-dark">{stats.females} Females</span>
                  </div>
                  <div className="d-flex align-items-center bg-white shadow-sm rounded-pill px-3 py-2 border border-light">
                    <Icon icon="solar:calendar-bold" className="me-2" fontSize={20} style={{ color: '#9c27b0' }} />
                    <span className="small fw-bold text-dark">{stats.avgAge} yrs Avg</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tree Section */}
            <div className="row">
              {/* Main Family Tree View */}
              <div className="col-12">
                <div className="card border-0 shadow-sm rounded-4 mt-2">
                  <div className="card-body p-0 position-relative mt-2">
                    {/* Adjustable Height Container */}
                    <div
                      style={{
                        height: 'calc(100vh - 200px)',
                        minHeight: '600px',
                        transition: 'height 0.3s ease',
                        resize: 'vertical',
                        overflow: 'auto'
                      }}
                      className="family-tree-container"
                    >
                      <FamilyTreeView
                        treeData={treeData}
                        currentUser={user}
                        onAddMember={handleAddMember}
                        onEditMember={handleEditMember}
                        onDeleteMember={onClickDeleteMember}
                        onNodeClick={handleNodeClick}
                        initialSelectedNodeId={user?.id}
                        guardianId={treeData?.tree?.guardianId}
                        onSetGuardian={handleSetGuardian}
                        highlightedUserId={highlightedMemberId}
                      />
                    </div>
                    {/* Resizer Handle Indication (Optional visual cue) */}
                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 pointer-events-none opacity-50">
                      <Icon icon="solar:minimize-square-linear" className="text-secondary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Member Modal */}
        <EditMemberModal
          show={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedMember(null);
          }}
          onUpdate={handleUpdateMember}
          memberData={selectedMember}
        />

        {/* Add Relationship Modal */}
        {targetMemberForAdd && (
          <AddRelationshipModal
            show={showRelationshipModal}
            onClose={() => {
              setShowRelationshipModal(false);
              setTargetMemberForAdd(null);
            }}
            member={targetMemberForAdd}
            onSelectRelationship={handleSelectRelationship}
            getMemberDetails={(userId) => findMemberInTree(treeData, userId)}
            rootId={treeData?.tree?.rootPersonId}
          />
        )}

        {/* Add Member Modal */}
        {targetMemberForAdd && (
          <AddMemberModal
            show={showAddMemberModal}
            onClose={() => {
              setShowAddMemberModal(false);
              setTargetMemberForAdd(null);
              setSelectedRelationship(null);
            }}
            onAdd={handleSaveNewMember}
            targetUserId={targetMemberForAdd.userId}
            relationship={selectedRelationship}
            targetMemberGender={targetMemberForAdd.gender}
            targetMemberName={`${targetMemberForAdd.firstname} ${targetMemberForAdd.lastname}`}
            targetMemberPartners={targetMemberForAdd.partners}
          />
        )}

        {/* Delete Confirmation Modal */}
        {memberToDelete && (
          <DeleteMemberModal
            show={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setMemberToDelete(null);
            }}
            onDelete={handleConfirmDelete}
            memberName={memberToDelete.fullName || `${memberToDelete.firstname || ''} ${memberToDelete.lastname || ''}`}
          />
        )}
      </div>
    </MasterLayout>
  );
};

export default FamilyTreePage;