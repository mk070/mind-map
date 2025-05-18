import React, { useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Plus, Trash } from 'lucide-react';
import { useMindMap } from '../../context/MindMapContext';
import { useSettingsStore } from '../../store/settingsStore';
import { getColorClass, getContrastText } from '../../utils/helpers';
import { gsap } from 'gsap';

const defaultNodeColor = '#3b82f6'; // blue-500

const Node = ({ node, onDrag }) => {
  const { 
    updateNode, 
    removeNode,
    addChildNode,
    selectNode,
    selectedNodeId,
    draggingNodeId,
    startDraggingNode,
    stopDraggingNode,
    setSelectedNodeId
  } = useMindMap();
  
  const { defaultNodeColor, autoExpandNodes, animationsEnabled } = useSettingsStore();
  const nodeRef = useRef(null);
  const controlsRef = useRef(null);
  const isHovering = useRef(false);
  const isEditingRef = useRef(false);
  
  // Define state-dependent variables first
  const isSelected = selectedNodeId === node.id;
  const isDragging = draggingNodeId === node.id;
  const isMainNode = !node.parentId;
  const colorClass = getColorClass(node.color || defaultNodeColor);
  const textClass = getContrastText(node.color || defaultNodeColor);
  const cursorClass = isMainNode ? 'cursor-move' : 'default';
  
  // Handle node selection
  const handleSelect = useCallback((e) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
  }, [node.id, setSelectedNodeId]);
  
  // Handle node deletion
  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this node and all its children?')) {
      removeNode(node.id);
    }
  }, [removeNode, node.id]);
  
  // Handle adding a child node
  const handleAddChild = useCallback((e) => {
    e.stopPropagation();
    addChildNode(node.id);
  }, [addChildNode, node.id]);
  
  // Handle node content editing
  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    if (isEditingRef.current) return;
    
    isEditingRef.current = true;
    const newContent = prompt('Edit node:', node.content || '');
    if (newContent !== null && newContent !== node.content) {
      updateNode(node.id, { content: newContent });
    }
    
    isEditingRef.current = false;
  }, [node.content, node.id, updateNode]);
  
  // Handle mouse enter/leave for controls visibility
  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
  }, []);
  
  // Update controls visibility based on selection and hover
  useEffect(() => {
    if (controlsRef.current) {
      if (isSelected || isHovering.current) {
        controlsRef.current.style.opacity = '1';
        controlsRef.current.style.pointerEvents = 'auto';
      } else {
        controlsRef.current.style.opacity = '0';
        controlsRef.current.style.pointerEvents = 'none';
      }
    }
  }, [isSelected]);
  
  // Apply entrance animation 
  useEffect(() => {
    if (!animationsEnabled || !nodeRef.current) return;
    
    gsap.effects.nodeExpand(nodeRef.current);
  }, [animationsEnabled]);
  
  // State-dependent variables are now defined at the top of the component
  
  return (
    <motion.div
      ref={nodeRef}
      data-node-id={node.id}  // Add this line
      className={` absolute group ${isMainNode ? 'node-main' : 'node-child'} ${
        isSelected ? 'ring-2 ring-primary-500' : 'ring-1 ring-transparent'
      } ${cursorClass} transition-all duration-200 rounded-lg `}
      style={{ 
        left: node.x, 
        top: node.y,
        zIndex: isSelected ? 10 : 1,
        pointerEvents: 'auto',
        position: 'absolute',
        transformOrigin: 'center center'
      }}
      initial={{ opacity: 1, scale: 0.97 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }}
      onClick={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      drag={isMainNode}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: -Infinity,
        right: Infinity,
        top: -Infinity,
        bottom: Infinity,
      }}
      onDragStart={(e, info) => {
        e.stopPropagation();
        if (isMainNode) {
          startDraggingNode(node.id);
        }
      }}
      onDragEnd={() => {
        if (isMainNode) {
          stopDraggingNode();
        }
      }}
      onDrag={(e, info) => {
        if (isMainNode) {
          const { x, y } = info.point;
          onDrag(x, y);
        }
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.1 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <div className="flex items-center gap-2 min-w-[120px] px-3 py-2">
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${colorClass}`}></div>
        <h3 className="text-sm font-medium truncate max-w-[180px]">
          {node.content || 'Untitled'}
        </h3>
      </div>
      
      {/* Node controls */}
      <div 
        ref={controlsRef}
        className="absolute right-[-2px] top-[-2px] bg-surface-light/90 dark:bg-surface-dark/90 rounded-bl-lg rounded-tr-lg border border-surface-dark/10 dark:border-surface-light/10 shadow-sm p-1 flex gap-1 opacity-0 transition-opacity duration-200"
      >
        <button 
          className="p-1.5 rounded hover:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400"
          onClick={handleEdit}
          title="Edit node"
        >
          <Edit size={14} />
        </button>
        <button 
          className="p-1.5 rounded hover:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400"
          onClick={handleAddChild}
          title="Add child node"
        >
          <Plus size={14} />
        </button>
        <button 
          className="p-1.5 rounded hover:bg-danger-500/10 text-danger-500"
          onClick={handleDelete}
          title="Delete node"
        >
          <Trash size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default Node;