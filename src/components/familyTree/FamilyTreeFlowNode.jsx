import React from "react";
import { Handle, Position } from "reactflow";
import FamilyTreeCard from "./FamilyTreeCard";

const FamilyTreeFlowNode = ({ data }) => {
  const { node, isSelected, onSelect, onAddMember, onEdit, onDelete, onSetGuardian, isMenuOpen, onToggleMenu } = data;

  if (!node) return null;

  // RBAC for "Add" button on the card itself
  const currentUser = node.currentUser; // We passed it in node data
  const canAdd = currentUser.isAdmin || currentUser.isSuperAdmin || currentUser?.id === node.userId;

  // RBAC for "Delete" (Only Admin/SuperAdmin can delete OTHERS)
  const canDelete = (currentUser.isAdmin || currentUser.isSuperAdmin) && currentUser?.id !== node.userId;


  return (
    <div style={{ position: 'relative' }}>
      {/* Invisible handles for connections - properly positioned */}
      <Handle
        type="target"
        position={Position.Top}
        id="parent-top"
        style={{
          top: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          visibility: 'hidden',
          width: 1,
          height: 1,
          border: 'none',
          background: 'transparent',
          pointerEvents: 'none'
        }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="child-bottom"
        style={{
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          visibility: 'hidden',
          width: 1,
          height: 1,
          border: 'none',
          background: 'transparent',
          pointerEvents: 'none'
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="partner-right"
        style={{
          right: -5,
          top: '50%',
          transform: 'translateY(-50%)',
          visibility: 'hidden',
          width: 1,
          height: 1,
          border: 'none',
          background: 'transparent',
          pointerEvents: 'none'
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="partner-left"
        style={{
          left: -5,
          top: '50%',
          transform: 'translateY(-50%)',
          visibility: 'hidden',
          width: 1,
          height: 1,
          border: 'none',
          background: 'transparent',
          pointerEvents: 'none'
        }}
      />

      {/* The actual card - show add button in flow view */}
      <FamilyTreeCard
        member={node}
        isSelected={isSelected}
        onSelect={onSelect}
        onAddMember={onAddMember}
        onEdit={onEdit}
        onDelete={onDelete}
        showAddButton={canAdd}
        showDeleteButton={canDelete}
        currentUser={currentUser}
        onSetGuardian={onSetGuardian}
        isMenuOpen={isMenuOpen}
        onToggleMenu={onToggleMenu}
        getMemberDetails={node.getMemberDetails}
        rootId={node.rootId}
      />
    </div>
  );
};

export default FamilyTreeFlowNode;

