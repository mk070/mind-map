import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Edit, Plus, Trash } from 'lucide-react';
import { useMindMap } from '../../context/MindMapContext';
import { useSettingsStore } from '../../store/settingsStore';
import { getColorClass, getContrastText } from '../../utils/helpers';
import { gsap } from 'gsap';

const Node = ({ node, onDrag }) => {
  const { 
    updateNode, 
    removeNode,
    addChildNode,
    selectNode,
    selectedNodeRef,
    draggingNodeRef,
    startDraggingNode,
    stopDraggingNode
  } = useMindMap();
  
  const { defaultNodeColor, autoExpandNodes, animationsEnabled } = useSettingsStore();
  const nodeRef = useRef(null);
  const isEditingRef = useRef(false);
  
  // Apply entrance animation 
  useEffect(() => {
    if (!animationsEnabled || !nodeRef.current) return;
    
    gsap.effects.nodeExpand(nodeRef.current);
  }, [animationsEnabled]);
  
  const handleEdit = (e) => {
    e.stopPropagation();
    if (isEditingRef.current) return;
    
    isEditingRef.current = true;
    const content = prompt('Edit node content:', node.content);
    
    if (content !== null && content.trim() !== '') {
      updateNode(node.id, { content });
    }
    
    isEditingRef.current = false;
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this node and all its children?')) {
      removeNode(node.id);
    }
  };
  
  const handleAddChild = (e) => {
    e.stopPropagation();
    addChildNode(node.id);
  };
  
  const isSelected = selectedNodeRef.current === node.id;
  const isDragging = draggingNodeRef.current === node.id;
  
  const colorClass = getColorClass(node.color || defaultNodeColor);
  const textClass = getContrastText(node.color || defaultNodeColor);
  
  const isMainNode = !node.parentId;
  
  return (
    <motion.div
      ref={nodeRef}
      className={`absolute ${isMainNode ? 'node-main' : 'node-child'} ${isSelected ? 'ring-2 ring-primary-500' : ''} cursor-move`}
      style={{ 
        left: node.x, 
        top: node.y,
        zIndex: isDragging ? 10 : 1,
        pointerEvents: 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectNode(node.id);
      }}
      drag
      dragMomentum={false}
      onDragStart={(e, info) => {
        e.stopPropagation();
        selectNode(node.id);
        startDraggingNode(node.id);
      }}
      onDragEnd={() => {
        stopDraggingNode();
      }}
      onDrag={(e, info) => {
        // Only update position when actually dragging (not just hovering)
        if (isDragging) {
          const { x, y } = info.point;
          onDrag(x, y);
        }
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      dragElastic={0}
      dragConstraints={{
        left: -Infinity,
        right: Infinity,
        top: -Infinity,
        bottom: Infinity,
      }}
    >
      <div className="flex items-center gap-2 min-w-[120px]">
        <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
        <h3 className="text-sm font-medium">{node.content || 'Untitled'}</h3>
      </div>
      
      {/* Node controls - visible on hover or selection */}
      <div className={`absolute right-[-2px] top-[-2px] bg-surface-light/90 dark:bg-surface-dark/90 rounded-bl-lg rounded-tr-lg border border-surface-dark/10 dark:border-surface-light/10 shadow-sm p-1 flex gap-1 opacity-0 group-hover:opacity-100 ${isSelected ? 'opacity-100' : ''}
        transition-opacity duration-200`}
      >
        <button 
          className="p-1 rounded hover:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400"
          onClick={handleEdit}
        >
          <Edit size={14} />
        </button>
        <button 
          className="p-1 rounded hover:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400"
          onClick={handleAddChild}
        >
          <Plus size={14} />
        </button>
        <button 
          className="p-1 rounded hover:bg-danger-500/10 text-danger-500"
          onClick={handleDelete}
        >
          <Trash size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default Node;