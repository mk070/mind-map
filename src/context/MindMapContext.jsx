import React, { createContext, useContext, useState, useRef } from 'react';
import { useNodeStore } from '../store/nodeStore';

const MindMapContext = createContext(null);

export const useMindMap = () => {
  const context = useContext(MindMapContext);
  if (!context) {
    throw new Error('useMindMap must be used within a MindMapProvider');
  }
  return context;
};

export const MindMapProvider = ({ children }) => {
  const { nodes, connections, addNode,updateNode, updateNodePosition, removeNode } = useNodeStore();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const draggingNodeRef = useRef(null);
  const selectedNodeRef = useRef(null);

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const setCanvasPosition = (newPosition) => {
    setPosition(newPosition);
  };

  const startDraggingNode = (nodeId) => {
    draggingNodeRef.current = nodeId;
  };

  const stopDraggingNode = () => {
    draggingNodeRef.current = null;
  };

  const selectNode = (nodeId) => {
    selectedNodeRef.current = nodeId;
  };

  const addChildNode = (parentId) => {
    // Calculate position offset from parent node
    const parentNode = nodes.find(node => node.id === parentId);
    if (!parentNode) return;
    
    const angle = Math.random() * 2 * Math.PI;
    const distance = 150;
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;
    
    addNode({
      x: parentNode.x + offsetX,
      y: parentNode.y + offsetY,
      parentId
    });
  };

  const contextValue = {
    nodes,
    connections,
    addNode,
    updateNode,
    updateNodePosition,
    removeNode,
    canvasRef,
    scale,
    position,
    zoomIn,
    zoomOut,
    resetView,
    setCanvasPosition,
    draggingNodeRef,
    startDraggingNode,
    stopDraggingNode,
    selectedNodeRef,
    selectNode,
    addChildNode,
  };

  return (
    <MindMapContext.Provider value={contextValue}>
      {children}
    </MindMapContext.Provider>
  );
};