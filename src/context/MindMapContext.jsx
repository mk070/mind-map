import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useNodeStore } from '../store/nodeStore';
import { gsap } from 'gsap';


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

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);

  const selectNode = (nodeId) => {
    selectedNodeRef.current = nodeId;
    setSelectedNodeId(nodeId);
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

  const clearAll = () => {
    useNodeStore.getState().clearAll();
    setSelectedNodeId(null);
    setSearchQuery('');
    setSearchResults([]);
    setCurrentResultIndex(-1);
  };

  // Search functionality
  const searchNodes = (query) => {
    if (!query.trim()) {
      resetSearch();
      return;
    }
    
    const results = nodes.filter(node => 
      node.content.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
    setCurrentResultIndex(results.length > 0 ? 0 : -1);
    
    if (results.length > 0) {
      focusOnNode(results[0].id);
    }
  };
  
  const focusOnNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    
    // Get the viewport center relative to the canvas
    const viewportCenterX = canvasRect.width / 2;
    const viewportCenterY = canvasRect.height / 2;
    
    // Calculate the new position that will center the node
    const targetX = viewportCenterX - (node.x * scale) - position.x;
    const targetY = viewportCenterY - (node.y * scale) - position.y;

    // Debug - remove in production
    console.log("Node position:", node.x, node.y);
    console.log("Canvas size:", canvasRect.width, canvasRect.height);
    console.log("Current position:", position.x, position.y);
    console.log("Target position:", targetX, targetY);

    
    // Always animate the transition for smoother UX
    gsap.to(position, {
      x: targetX,
      y: targetY,
      duration: 0.75,
      ease: 'power2.out',
      onUpdate: () => setPosition({ x: position.x, y: position.y }),
      onComplete: () => {
        // Set the final position when animation is complete
        setPosition({ x: targetX, y: targetY });
        highlightNode(nodeId);
      }
    });
  };
  
  // Add this highlightNode function that doesn't rely on animationsEnabled
  const highlightNode = (nodeId) => {
    // Get the node DOM element
    const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!nodeElement) return;
  
    // Create a pulsing glow effect
    gsap.killTweensOf(nodeElement);
    
    gsap.fromTo(
      nodeElement,
      { 
        boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.7)' 
      },
      { 
        boxShadow: '0 0 15px 5px rgba(99, 102, 241, 0)',
        duration: 1.5,
        ease: 'power2.out',
        repeat: 2,
        yoyo: true
      }
    );
  };
  
  
  const navigateToResult = (direction) => {
    if (searchResults.length === 0) return;
    
    let newIndex = currentResultIndex + direction;
    if (newIndex < 0) newIndex = searchResults.length - 1;
    if (newIndex >= searchResults.length) newIndex = 0;
    
    setCurrentResultIndex(newIndex);
    focusOnNode(searchResults[newIndex].id);
  };
  
  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentResultIndex(-1);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (searchResults.length === 0) return;
      
      if (e.key === 'Enter' && e.shiftKey) {
        // Shift+Enter: previous result
        e.preventDefault();
        navigateToResult(-1);
      } else if (e.key === 'Enter') {
        // Enter: next result
        e.preventDefault();
        navigateToResult(1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchResults, currentResultIndex]);

  const contextValue = {
    nodes,
    connections,
    addNode,
    updateNode,
    updateNodePosition,
    removeNode,
    clearAll,
    canvasRef,
    scale,
    position,
    zoomIn,
    zoomOut,
    resetView,
    setCanvasPosition,
    startDraggingNode,
    stopDraggingNode,
    selectNode,
    setSelectedNodeId,
    addChildNode,
    draggingNodeRef,
    selectedNodeRef,
    selectedNodeId,
    draggingNodeId: draggingNodeRef.current,
    searchQuery,
    searchResults,
    currentResultIndex,
    setSearchQuery,
    searchNodes,
    navigateToResult,
    resetSearch,
  };

  return (
    <MindMapContext.Provider value={contextValue}>
      {children}
    </MindMapContext.Provider>
  );
};