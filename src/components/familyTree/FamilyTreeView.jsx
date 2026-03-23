import React, { useMemo, useEffect, useState, useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position
} from "reactflow";
import "reactflow/dist/style.css";
import FamilyTreeFlowNode from "./FamilyTreeFlowNode";
import "./FamilyTree.css";

const MarriageNode = () => {
  return (
    <div style={{ width: 1, height: 1, background: 'transparent' }}>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: 'transparent', border: 'none' }}
      />
    </div>
  );
};

const nodeTypes = {
  familyNode: FamilyTreeFlowNode,
  marriageNode: MarriageNode,
};

const FamilyTreeView = ({ treeData, currentUser, onAddMember, onEditMember, onDeleteMember, onNodeClick, onAddRelative, initialSelectedNodeId, guardianId, onSetGuardian, highlightedUserId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(initialSelectedNodeId || null);
  const [activeMenuNodeId, setActiveMenuNodeId] = useState(null);
  const [rfInstance, setRfInstance] = useState(null);
  const hasInitializedSelection = useRef(false);

  const onNodeClickInternal = useCallback((event, node) => {
    if (node.type === 'familyNode') {
      setSelectedNodeId(node.id);
      if (onNodeClick) {
        onNodeClick(node.data.node);
      }
    }
  }, [onNodeClick]);

  const handleAddMember = useCallback((memberData) => {
    if (onAddMember) {
      onAddMember(memberData);
    }
  }, [onAddMember]);

  const handleEditMember = useCallback((member) => {
    if (onEditMember) {
      onEditMember(member);
    }
  }, [onEditMember]);

  const handleDeleteMember = useCallback((member) => {
    if (onDeleteMember) {
      onDeleteMember(member);
    }
  }, [onDeleteMember]);

  // Update selectedNodeId when initialSelectedNodeId changes (only once on initial load)
  useEffect(() => {
    if (!hasInitializedSelection.current && initialSelectedNodeId && treeData && treeData.people) {
      // Verify the node exists in the tree before setting it as selected
      const nodeExists = treeData.people.some(p => p.id === initialSelectedNodeId);
      if (nodeExists) {
        setSelectedNodeId(initialSelectedNodeId);
        hasInitializedSelection.current = true;
        // NOTE: We no longer trigger onNodeClick automatically here because it now causes 
        // immediate navigation to the profile page. Selection is handled visually only.
      }
    }
  }, [initialSelectedNodeId, treeData]); // Removed onNodeClick from dependencies as we don't call it anymore

  // Handle Highlighted User from Search
  useEffect(() => {
    if (highlightedUserId && nodes.length > 0) {
      setSelectedNodeId(highlightedUserId);
    }
  }, [highlightedUserId, nodes]);

  useEffect(() => {
    if (!treeData || !treeData.people) {
      setNodes([]);
      setEdges([]);
      // Reset initialization flag when tree data is cleared
      hasInitializedSelection.current = false;
      return;
    }

    const { people, families, tree } = treeData;
    const rootId = tree.rootPersonId;

    if (!rootId && people.length === 0) return;

    // Filter Logic: Identify nodes to hide based on Current User relationships
    const hiddenNodeIds = new Set();
    const currentUserNode = people.find(p => p.id === currentUser?.id);

    if (currentUserNode) {
      // 1. Hide Current User's Partner's Family (Parents/Siblings), but SHOW the Partner
      if (currentUserNode.relationships?.partnerId) {
        const partner = people.find(p => p.id === currentUserNode.relationships.partnerId);
        if (partner) {
          if (partner.relationships?.fatherId) hiddenNodeIds.add(partner.relationships.fatherId);
          if (partner.relationships?.motherId) hiddenNodeIds.add(partner.relationships.motherId);
          if (partner.relationships?.siblingIds) partner.relationships.siblingIds.forEach(sid => hiddenNodeIds.add(sid));
        }
      }

      // 2. Hide Current User's Siblings' Partner's Family (Parents/Siblings), but SHOW the Partner
      if (currentUserNode.relationships?.siblingIds) {
        currentUserNode.relationships.siblingIds.forEach(sid => {
          const sibling = people.find(p => p.id === sid);
          if (sibling && sibling.relationships?.partnerId) {
            const partner = people.find(p => p.id === sibling.relationships.partnerId);
            if (partner) {
              if (partner.relationships?.fatherId) hiddenNodeIds.add(partner.relationships.fatherId);
              if (partner.relationships?.motherId) hiddenNodeIds.add(partner.relationships.motherId);
              if (partner.relationships?.siblingIds) partner.relationships.siblingIds.forEach(psid => hiddenNodeIds.add(psid));
            }
          }
        });
      }

      // 3. Hide Mother's Family (Maternal Grandparents and Uncles/Aunts)
      if (currentUserNode.relationships?.motherId) {
        const mother = people.find(p => p.id === currentUserNode.relationships.motherId);
        if (mother) {
          if (mother.relationships?.fatherId) hiddenNodeIds.add(mother.relationships.fatherId);
          if (mother.relationships?.motherId) hiddenNodeIds.add(mother.relationships.motherId);
          if (mother.relationships?.siblingIds) mother.relationships.siblingIds.forEach(sid => hiddenNodeIds.add(sid));
        }
      }

      // 4. Hide Current User's Children's Partner's Family (Parents/Siblings), but SHOW the Partner
      if (currentUserNode.relationships?.childrenIds) {
        currentUserNode.relationships.childrenIds.forEach(cid => {
          const child = people.find(p => p.id === cid);
          if (child && child.relationships.partnerId) {
            const partner = people.find(p => p.id === child.relationships.partnerId);
            if (partner) {
              if (partner.relationships?.fatherId) hiddenNodeIds.add(partner.relationships.fatherId);
              if (partner.relationships?.motherId) hiddenNodeIds.add(partner.relationships.motherId);
              if (partner.relationships?.siblingIds) partner.relationships.siblingIds.forEach(sid => hiddenNodeIds.add(sid));
            }
          }
        });
      }
    }

    const levels = new Map();
    const visited = new Set();
    const queue = [];

    // Helper to identify partner's parents for visual separation
    const partnerParentIds = new Set();
    if (currentUserNode?.relationships?.partnerId) {
      const partner = people.find(p => p.id === currentUserNode.relationships.partnerId);
      if (partner) {
        if (partner.relationships?.fatherId) partnerParentIds.add(partner.relationships.fatherId);
        if (partner.relationships?.motherId) partnerParentIds.add(partner.relationships.motherId);
      }
    }

    const getVerticalOffset = (id) => {
      // Shift partner's parents up by 50px to separate lines
      return partnerParentIds.has(id) ? -50 : 0;
    };

    // Initialize Queue - Start from Current User to show only their connected graph
    let startNodeId = null;
    if (currentUserNode && !hiddenNodeIds.has(currentUserNode.id)) {
      startNodeId = currentUserNode.id;
    } else if (rootId && !hiddenNodeIds.has(rootId)) {
      startNodeId = rootId;
    }

    if (startNodeId) {
      levels.set(startNodeId, 0);
      visited.add(startNodeId);
      queue.push({ id: startNodeId, level: 0 });
    } else if (people.length > 0) {
      const firstVisible = people.find(p => !hiddenNodeIds.has(p.id));
      if (firstVisible) {
        levels.set(firstVisible.id, 0);
        visited.add(firstVisible.id);
        queue.push({ id: firstVisible.id, level: 0 });
      }
    }

    const addToQueue = (id, level) => {
      if (!id || visited.has(id) || hiddenNodeIds.has(id)) return;
      visited.add(id);
      levels.set(id, level);
      queue.push({ id, level });
    };

    let head = 0;
    while (head < queue.length) {
      const { id, level } = queue[head++];
      const person = people.find(p => p.id === id);
      if (!person) continue;

      if (person.relationships?.siblingIds) {
        person.relationships.siblingIds.forEach(sid => addToQueue(sid, level));
      }
      if (person.relationships?.partnerId) {
        // Only traverse to partner if not hidden
        if (!hiddenNodeIds.has(person.relationships.partnerId)) {
          addToQueue(person.relationships.partnerId, level);
        }
      }
      if (person.relationships?.childrenIds) {
        person.relationships.childrenIds.forEach(cid => addToQueue(cid, level + 1));
      }
      if (person.relationships?.fatherId) addToQueue(person.relationships.fatherId, level - 1);
      if (person.relationships?.motherId) addToQueue(person.relationships.motherId, level - 1);
    }

    let changed = true;
    let iterations = 0;

    while (changed && iterations < 10) {
      changed = false;
      iterations++;

      people.forEach(person => {
        const currentLevel = levels.get(person.id);
        if (currentLevel === undefined) return;

        const fatherId = person.relationships?.fatherId;
        const motherId = person.relationships?.motherId;

        if (fatherId || motherId) {
          let minRequiredLevel = -Infinity;

          if (fatherId) {
            const fatherLevel = levels.get(fatherId);
            if (fatherLevel !== undefined) {
              minRequiredLevel = Math.max(minRequiredLevel, fatherLevel + 1);
            }
          }

          if (motherId) {
            const motherLevel = levels.get(motherId);
            if (motherLevel !== undefined) {
              minRequiredLevel = Math.max(minRequiredLevel, motherLevel + 1);
            }
          }

          if (minRequiredLevel > -Infinity && currentLevel < minRequiredLevel) {
            levels.set(person.id, minRequiredLevel);
            changed = true;
          }
        }
      });
    }

    // Hide all nodes that are not in the queue OR Not CONNECTED WITH CURRENT USER
    // people.forEach(p => {
    //   if (!visited.has(p.id) && !hiddenNodeIds.has(p.id)) levels.set(p.id, 0);
    // });

    const nodesByLevel = new Map();
    let minLevel = 0;
    let maxLevel = 0;

    levels.forEach((level, id) => {
      if (!nodesByLevel.has(level)) nodesByLevel.set(level, []);
      nodesByLevel.get(level).push(id);
      minLevel = Math.min(minLevel, level);
      maxLevel = Math.max(maxLevel, level);
    });

    const flowNodes = [];
    const flowEdges = [];
    const nodePositions = new Map();

    const NODE_WIDTH = 220;
    const PARTNER_SPACING = 360; // Distance from left of person to left of partner
    const X_SPACING = 200; // Horizontal gap between family groups
    const Y_SPACING = 300;

    // Helper to find partner
    const getPartnerId = (id) => {
      const p = people.find(x => x.id === id);
      return p?.relationships?.partnerId;
    };

    // --- Step 1: Calculate Subtree Widths (Bottom-Up) ---
    const subtreeWidths = new Map(); // Width of the entire subtree rooted at this unit
    const unitWidths = new Map();    // Width of just this node pair (Node + Partner)

    // Helper: consistently identify the "Primary" key for a couple to share data
    // We'll just store data on BOTH IDs to avoid lookup misses.

    // We iterate from bottom levels up
    for (let level = maxLevel; level >= minLevel; level--) {
      const levelIds = nodesByLevel.get(level) || [];
      const processedInLoop = new Set();
      const nextLevelIds = nodesByLevel.get(level + 1) || [];

      levelIds.forEach(id => {
        if (processedInLoop.has(id)) return;

        const person = people.find(p => p.id === id);
        if (!person) return;

        const partnerId = getPartnerId(id);
        const isPartnerSameLevel = partnerId && levels.get(partnerId) === level;

        let unitMembers = [id];
        if (isPartnerSameLevel) unitMembers.push(partnerId);

        // Mark processed
        unitMembers.forEach(m => processedInLoop.add(m));

        // 1. Calculate Core Unit Width (Parents only)
        // Standard: 220 per node + 360 gap if partner exists (which implies 2 nodes)
        // Logic: if 2 members, width = 220 + (360-220) + 220?
        // Wait, PARTNER_SPACING (360) is "Left of P1 to Left of P2".
        // P2 is 220 wide.
        // Total Width = 360 + 220 = 580.
        // If single: 220.
        let coreWidth = unitMembers.length > 1 ? (PARTNER_SPACING + NODE_WIDTH) : NODE_WIDTH;

        unitMembers.forEach(m => unitWidths.set(m, coreWidth));

        // 2. Calculate Children Width
        // Robust Method: Scan ALL nodes in next level to find children of this unit
        // This avoids missing children if 'childrenIds' prop is stale.
        const validChildren = nextLevelIds.filter(cid => {
          const child = people.find(c => c.id === cid);
          if (!child) return false;
          const father = child.relationships?.fatherId;
          const mother = child.relationships?.motherId;
          // Check if this child belongs to ANY member of our current unit
          return unitMembers.includes(father) || unitMembers.includes(mother);
        });

        let childrenBlockWidth = 0;

        // Group children into their own units (since siblings are connected)
        // We need to know which children are partners to each other (rare/incest?) or just distinct units.
        // Children typically are separate units or coupled with external people.
        const childUnitsProcessed = new Set();
        const childUnitWidths = [];

        validChildren.forEach(cid => {
          if (childUnitsProcessed.has(cid)) return;

          // Get child's unit info
          const cPartner = getPartnerId(cid);
          // If child's partner is ALSO a child of this family? (Cousin marriage/Sibling marriage? Hopefully not).
          // Assuming distinct.

          let cWidth = subtreeWidths.get(cid) || NODE_WIDTH;
          // If cached width exists, it includes THAT child's partner and subtree.

          // Note: If child's partner is NOT in `allChildren`, `subtreeWidths.get(cid)` 
          // should already account for the partner if they were processed in a lower level.
          // If the partner is on the SAME level as the child (likely), they were processed together in that lower level loop.
          // So `subtreeWidths.get(cid)` is the full width of Child+Spouse+Grandkids.

          childUnitWidths.push(cWidth);
          childUnitsProcessed.add(cid);

          // If partner exists and likely processed with child, ensure we don't double count if they appear in `allChildren` list
          if (cPartner) childUnitsProcessed.add(cPartner);
        });

        if (childUnitWidths.length > 0) {
          const sumWidth = childUnitWidths.reduce((a, b) => a + b, 0);
          const totalSpacing = (childUnitWidths.length - 1) * X_SPACING;
          childrenBlockWidth = sumWidth + totalSpacing;
        }

        // 3. Final Subtree Width
        const totalWidth = Math.max(coreWidth, childrenBlockWidth);

        // Store for ALl members
        unitMembers.forEach(m => subtreeWidths.set(m, totalWidth));
      });
    }

    // --- Step 2: Position Nodes (Top-Down) ---
    const processedNodes = new Set();

    // Reset X tracker per level? NO. 
    // We need a global strategy or per-parent strategy.
    // Standard approach:
    // Iterate Levels.
    // Within Level, group by Parent.
    // Place Parent Groups.
    // Track `currentX` to ensure groups don't overlap.

    for (let level = minLevel; level <= maxLevel; level++) {
      const levelIds = nodesByLevel.get(level) || [];
      let currentX = 0;

      // Identify Units/Groups
      // We want to process units, but ORDERED by their connection to upper level (Parents).

      const units = [];
      const processedInLevel = new Set();

      levelIds.forEach(id => {
        if (processedInLevel.has(id)) return;
        const partner = getPartnerId(id);
        const isPartnerSameLevel = partner && levels.get(partner) === level;

        let representative = id;

        if (isPartnerSameLevel) {
          // Crucial Fix: Determine which of the pair is the "Blood Relative" (has parents in the tree).
          // If we pick the in-law (who has no parents here) as representative, 
          // they won't be grouped with siblings and will default to X=0 position, causing overlap.
          const p1 = people.find(p => p.id === id);
          const p2 = people.find(p => p.id === partner);

          const hasParent1 = p1 && (p1.relationships?.fatherId || p1.relationships?.motherId);
          const hasParent2 = p2 && (p2.relationships?.fatherId || p2.relationships?.motherId);

          if (!hasParent1 && hasParent2) {
            representative = partner;
          }
          // If both have parents or neither, we default to 'id' (first encountered).

          processedInLevel.add(partner);
        }

        // This is a unit
        units.push(representative);
        processedInLevel.add(id);
      });

      // Sort Units by Parent Position to maintain relative order and minimize line crossing
      units.sort((a, b) => {
        const pA = people.find(p => p.id === a);
        const pB = people.find(p => p.id === b);

        // Get primary parent X
        const getParentX = (p) => {
          if (!p) return -1;
          const pid = p.relationships?.fatherId || p.relationships?.motherId;
          if (pid && nodePositions.has(pid)) return nodePositions.get(pid).x;
          return -1;
        };

        const xa = getParentX(pA);
        const xb = getParentX(pB);
        if (xa !== xb) return xa - xb;
        return 0;
      });

      // Position Units
      units.forEach(unitId => {
        if (processedNodes.has(unitId)) return; // Should not happen with local sets

        const person = people.find(p => p.id === unitId);
        if (!person) return;

        const partnerId = getPartnerId(unitId);
        const hasPartner = partnerId && levels.get(partnerId) === level;

        // Determine Group (Siblings)
        const parentId = person.relationships?.fatherId || person.relationships?.motherId;

        let siblings = [];
        if (parentId) {
          // Find all units in this level that share this parent
          siblings = units.filter(u => {
            const p = people.find(x => x.id === u);
            if (!p) return false;
            return (p.relationships?.fatherId === person.relationships?.fatherId) ||
              (p.relationships?.motherId === person.relationships?.motherId);
          });
        } else {
          siblings = [unitId]; // Root or Disjoint
        }

        // Process this entire sibling group at once
        // Calculate Total Width of this Sibling Group
        let groupTotalWidth = 0;
        const spacing = X_SPACING;

        siblings.forEach(sib => {
          // Use the pre-calculated subtree width which INCLUDES children space
          const w = subtreeWidths.get(sib) || NODE_WIDTH;
          groupTotalWidth += w;
        });
        groupTotalWidth += (siblings.length - 1) * spacing;

        // Determine Start X (Preliminary: Box Centering)
        let startX = currentX;

        if (parentId && nodePositions.has(parentId)) {
          // Center under Parent
          // Parent Unit Center (Source of the line)
          const pPos = nodePositions.get(parentId);
          let pCenter = pPos.x + NODE_WIDTH / 2;

          // If parent is a couple, the line usually comes from the Marriage Node (midpoint)
          const pPartner = getPartnerId(parentId);
          if (pPartner && nodePositions.has(pPartner)) {
            // Marriage Node X is average of (P1 Center, P2 Center)
            const p2Pos = nodePositions.get(pPartner);
            const p1Center = pPos.x + NODE_WIDTH / 2;
            const p2Center = p2Pos.x + NODE_WIDTH / 2;
            pCenter = (p1Center + p2Center) / 2;
          }

          const idealBoxStartX = pCenter - (groupTotalWidth / 2);

          // Refinement: Blood-Relative Centering
          // Box centering aligns the entire chunk (including in-laws) to the parent.
          // This causes "bends" because the connection targets (Blood Children) are off-center regarding the box.
          // We calculate the center of mass of the *Blood Nodes* if placed at idealBoxStartX.

          let tempX = idealBoxStartX;
          let sumBloodCenters = 0;
          let bloodCount = 0;

          siblings.forEach(sib => {
            const w = subtreeWidths.get(sib) || NODE_WIDTH;
            const coreW = unitWidths.get(sib) || NODE_WIDTH;

            // Where would 'sib' be placed relative to tempX?
            const allocationCenter = tempX + w / 2;
            const coupleX = allocationCenter - (coreW / 2);

            // 'sib' is the Blood Relative (Representative).
            // Its center is coupleX + NODE_WIDTH / 2.
            const bloodCenter = coupleX + NODE_WIDTH / 2;

            sumBloodCenters += bloodCenter;
            bloodCount++;

            tempX += w + spacing;
          });

          const avgBloodCenter = sumBloodCenters / bloodCount;
          const shift = pCenter - avgBloodCenter;

          const idealAlignedStartX = idealBoxStartX + shift;

          startX = Math.max(currentX, idealAlignedStartX);
        }

        // Place Siblings
        siblings.forEach(sib => {
          if (processedNodes.has(sib)) return;

          const w = subtreeWidths.get(sib) || NODE_WIDTH;
          const coreW = unitWidths.get(sib) || NODE_WIDTH; // Width of just the couple

          // Place centered in its own subtree allocation
          // The subtree spans [startX, startX + UB]
          // The Couple should be in the middle of that.

          const allocationCenter = startX + w / 2;
          const coupleX = allocationCenter - (coreW / 2);

          nodePositions.set(sib, { x: coupleX, y: level * Y_SPACING + getVerticalOffset(sib) });
          processedNodes.add(sib);

          const sibPartner = getPartnerId(sib);
          if (sibPartner && levels.get(sibPartner) === level) {
            nodePositions.set(sibPartner, { x: coupleX + PARTNER_SPACING, y: level * Y_SPACING + getVerticalOffset(sibPartner) });
            processedNodes.add(sibPartner);
          }

          startX += w + spacing;
        });

        // Update global X cursor to prevent next group from overlapping
        // startX has already been incremented by (width + spacing) for each sibling in the loop.
        // So startX currently points to: rightmost_sibling_edge + spacing.
        currentX = startX;
      });
    }

    // --- Step 3: Generate Flow Nodes/Edges (unchanged logic mostly) ---
    // But iterate nodePositions map

    nodePositions.forEach((pos, id) => {
      const person = people.find(p => p.id === id);
      if (!person) return;

      const partner = person.relationships?.partnerId
        ? people.find(p => p.id === person.relationships.partnerId)
        : null;

      const rootId = tree.rootPersonId;
      const getMemberDetails = (pid) => people.find(p => p.id === pid);

      const nodeData = {
        userId: person.id,
        fullName: `${person.firstName} ${person.lastName}`,
        firstname: person.firstName,
        lastname: person.lastName,
        gender: person.gender,
        prefix: person.prefix,
        dob: person.dob,
        dateOfDeath: person.dateOfDeath,
        age: person.age,
        birthyear: person.yearOfBirth,
        profilePicture: person.profilePicture,
        email: person.email,
        phone: person.phone,
        isAdmin: person.isAdmin,
        isSuperAdmin: person.isSuperAdmin,
        isGuardian: person.id === guardianId,
        currentUser: currentUser, // Pass current user to node data
        partner: partner ? {
          userId: partner.id,
          fullName: `${partner.firstName} ${partner.lastName}`,
          profilePicture: partner.profilePicture,
          gender: partner.gender,
          dob: partner.dob
        } : null,
        father: person.relationships?.fatherId,
        mother: person.relationships?.motherId,
        childrenIds: person.relationships?.childrenIds,
        sons: [],
        daughters: [],
        rootId: rootId,
        getMemberDetails: getMemberDetails
      };

      flowNodes.push({
        id: id,
        type: 'familyNode',
        position: pos,
        data: {
          node: nodeData,
          isSelected: selectedNodeId === id,
          onSelect: (n) => setSelectedNodeId(n.userId),
          onAddMember: handleAddMember,
          onEdit: handleEditMember,
          onDelete: handleDeleteMember,
          onAddRelative: onAddRelative,
          onSetGuardian: onSetGuardian,
          isMenuOpen: activeMenuNodeId === id,
          onToggleMenu: (isOpen) => setActiveMenuNodeId(isOpen ? id : null)
        }
      });

      // RBAC logic for Ghost Nodes (Add Father / Mother)
      const canAdd = currentUser?.isAdmin || currentUser?.isSuperAdmin || currentUser?.id === person.id;

      if (onAddRelative && canAdd) {
        if (!person.relationships?.fatherId) {
          const addFatherId = `add-father-${id}`;
          flowNodes.push({
            id: addFatherId,
            type: 'addMemberNode',
            position: { x: pos.x - 80, y: pos.y - 180 },
            data: { label: 'Add father', onClick: () => onAddRelative(nodeData, 'father') }
          });
          flowEdges.push({
            id: `edge-${addFatherId}-${id}`,
            source: addFatherId,
            target: id,
            sourceHandle: null,
            targetHandle: 'parent-top',
            type: 'smoothstep',
            style: { stroke: '#9ca3af', strokeDasharray: '6,4', strokeWidth: 2, opacity: 0.6 },
            animated: false,
          });
        }

        if (!person.relationships?.motherId) {
          const addMotherId = `add-mother-${id}`;
          flowNodes.push({
            id: addMotherId,
            type: 'addMemberNode',
            position: { x: pos.x + 80, y: pos.y - 180 },
            data: { label: 'Add mother', onClick: () => onAddRelative(nodeData, 'mother') }
          });
          flowEdges.push({
            id: `edge-${addMotherId}-${id}`,
            source: addMotherId,
            target: id,
            sourceHandle: null,
            targetHandle: 'parent-top',
            type: 'smoothstep',
            style: { stroke: '#9ca3af', strokeDasharray: '6,4', strokeWidth: 2, opacity: 0.6 },
            animated: false,
          });
        }
      }
    });

    const NODE_HEIGHT = 110; // Increased card height

    const childEdgeMap = new Map(); // Key: childId, Value: { edge, priority }

    families.forEach(fam => {
      let marriageNodeId = null;
      const famId = fam.id || `fam-${fam.partnerIds.join('-')}`;

      // Priority 2 = Marriage connection (preferred)
      // Priority 1 = Single parent connection
      let currentPriority = 1;

      if (fam.partnerIds.length === 2) {
        const [p1, p2] = fam.partnerIds;
        if (nodePositions.has(p1) && nodePositions.has(p2)) {
          // Determine edge style based on lineage (Partner's Parents Marriage)
          let marriageEdgeColor = '#374151'; // Default Gray
          const currentPerson = people.find(p => p.id === currentUser?.id);
          if (currentPerson?.relationships?.partnerId) {
            const partnerId = currentPerson.relationships.partnerId;
            const partner = people.find(p => p.id === partnerId);
            if (partner) {
              // If this marriage connects Partner's Father and Mother
              if (fam.partnerIds.includes(partner.relationships?.fatherId) && fam.partnerIds.includes(partner.relationships?.motherId)) {
                marriageEdgeColor = '#ec4899'; // Pink
              }
            }
          }

          // Draw partner edge - Solid horizontal line for marriage (bidirectional)
          flowEdges.push({
            id: `edge-${p1}-${p2}`,
            source: p1,
            target: p2,
            sourceHandle: 'partner-right',
            targetHandle: 'partner-left',
            type: 'straight',
            style: {
              stroke: marriageEdgeColor,
              strokeWidth: 2,
              opacity: 0.9
            },
            animated: false,
          });

          // Always create marriage node for 2-partner families
          const pos1 = nodePositions.get(p1);
          const pos2 = nodePositions.get(p2);
          marriageNodeId = `marriage-${famId}`;
          currentPriority = 2; // We have a marriage node, so this is a strong connection

          // Calculate midpoint (center of the marriage edge between the two nodes)
          // Nodes are positioned at top-left, so we add half the node width to get center
          const node1CenterX = pos1.x + NODE_WIDTH / 2;
          const node2CenterX = pos2.x + NODE_WIDTH / 2;
          const midX = (node1CenterX + node2CenterX) / 2;
          const midY = pos1.y + NODE_HEIGHT / 2;

          flowNodes.push({
            id: marriageNodeId,
            type: 'marriageNode',
            position: { x: midX, y: midY },
            data: { label: '' },
            style: { width: 1, height: 1, visibility: 'hidden' },
            zIndex: -1
          });
        }
      }

      if (fam.childrenIds.length > 0) {
        fam.childrenIds.forEach(cid => {
          if (nodePositions.has(cid)) {
            const child = people.find(p => p.id === cid);
            if (!child) return;

            // Determine edge style based on lineage
            const isPartnerLineage = (() => {
              if (!currentUser) return false;

              // 1. Is this the edge connecting Partner to their parents?
              // Check if any child of this family is the partner of the current user
              // But we need the partner ID. 
              // We can find currentUser in `people` and get their partner ID.
              const currentPerson = people.find(p => p.id === currentUser.id);
              if (currentPerson?.relationships?.partnerId) {
                const partnerId = currentPerson.relationships.partnerId;
                if (fam.childrenIds.includes(partnerId)) return true;

                // 2. Is this the edge connecting Partner's parents to each other?
                // If this family consists of partner's father and mother
                const partner = people.find(p => p.id === partnerId);
                if (partner) {
                  if (fam.partnerIds.includes(partner.relationships?.fatherId) || fam.partnerIds.includes(partner.relationships?.motherId)) {
                    return true;
                  }
                }
              }
              return false;
            })();

            const edgeColor = isPartnerLineage ? '#ec4899' : '#374151'; // Pink for partner side, Gray for user side

            let newEdge = null;

            // Connect child to the center (marriage node) if it exists
            if (marriageNodeId) {
              newEdge = {
                id: `family-${famId}-child-${cid}`,
                source: marriageNodeId,
                target: cid,
                sourceHandle: 'bottom',
                targetHandle: 'parent-top',
                type: 'step',
                style: {
                  stroke: edgeColor,
                  strokeWidth: 2,
                  opacity: 0.9
                },
                animated: false,
              };
            } else {
              // Single parent (or hidden partner): Connect directly to the visible parent
              const visibleParentId = fam.partnerIds.find(pid => nodePositions.has(pid));

              if (visibleParentId) {
                newEdge = {
                  id: `parent-${visibleParentId}-child-${cid}`,
                  source: visibleParentId,
                  target: cid,
                  sourceHandle: 'child-bottom',
                  targetHandle: 'parent-top',
                  type: 'step',
                  style: {
                    stroke: edgeColor,
                    strokeWidth: 2,
                    opacity: 0.9
                  },
                  animated: false,
                };
              }
            }

            if (newEdge) {
              const existingRequest = childEdgeMap.get(cid);
              // Use logic: if no existing, or new has strictly higher priority 
              // (If equal, keep first one encountered prevents flicker, or we could handle tie-break if needed)
              if (!existingRequest || currentPriority > existingRequest.priority) {
                childEdgeMap.set(cid, { edge: newEdge, priority: currentPriority });
              }
            }
          }
        });
      }
    });

    // Add winning edges to the flow
    childEdgeMap.forEach(({ edge }) => {
      flowEdges.push(edge);
    });

    setNodes(flowNodes);
    setEdges(flowEdges);

  }, [treeData, selectedNodeId, handleAddMember, handleEditMember, handleDeleteMember, onAddRelative, setNodes, setEdges, initialSelectedNodeId, guardianId, onSetGuardian, activeMenuNodeId]);

  return (
    <div className="family-tree-container" style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickInternal}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        fitView
        fitViewOptions={{ maxZoom: 0.6 }}
        minZoom={0.1}
        maxZoom={2}
        onInit={setRfInstance}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color="#f8fafc" gap={20} size={1} />
        <Controls />
        {/* <MiniMap
          nodeColor={(node) => {
            if (node.type === 'familyNode') return '#06b6d4';
            if (node.type === 'addMemberNode') return '#e5e7eb';
            return '#eee';
          }}
          maskColor="rgba(240, 242, 245, 0.7)"
        /> */}
      </ReactFlow>
    </div>
  );
};

export default FamilyTreeView;