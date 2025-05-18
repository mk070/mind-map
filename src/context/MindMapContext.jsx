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
  const { nodes, connections, addNode, updateNode, updateNodePosition, removeNode } = useNodeStore();
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
      node.content && node.content.toLowerCase().includes(query.toLowerCase())
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
    
    // Get the viewport center
    const viewportCenterX = canvasRect.width / 2;
    const viewportCenterY = canvasRect.height / 2;
    
    // Calculate the position needed to center the node
    // Note: We need to invert the sign since we're moving the canvas, not the node
    const targetX = viewportCenterX / scale - node.x;
    const targetY = viewportCenterY / scale - node.y;
    console.log('targetX: ',targetX)
    console.log('targetY: ',targetY)
    
    // Use a ref to track the animation
    const animationRef = { current: null };
    
    // Animate to the target position
    animationRef.current = gsap.to({}, {
      duration: 0.75,
      ease: 'power2.out',
      onUpdate: function() {
        // Calculate interpolated position
        const progress = this.progress();
        const newX = position.x + (targetX - position.x) * progress;
        const newY = position.y + (targetY - position.y) * progress;
        console.log('newX: ',newX)
        console.log('newY: ',newY)
        
        // Update position during animation
        setPosition({ x: newX, y: newY });
      },
      onComplete: () => {
        // Ensure final position is set exactly
        setPosition({ x: targetX, y: targetY });
        highlightNode(nodeId);
      }
    });
  };
  
  const highlightNode = (nodeId) => {
    // Get the node DOM element
    const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!nodeElement) return;
  
    // Create a pulsing glow effect
    gsap.killTweensOf(nodeElement);
    
    gsap.fromTo(
      nodeElement,
      { 
        boxShadow: '0 0 0 4px rgba(99, 102, 241, 1)' 
      },
      { 
        boxShadow: '0 0 15px 5px rgba(99, 102, 241, 0)',
        duration: 1.5,
        ease: 'power2.out',
        repeat: 2,
        yoyo: true
      }
    );
    
    // Also select the node
    selectNode(nodeId);
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
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior for all shortcuts
      e.preventDefault();

      // Add Main Node (N)
      if (e.key === 'n' || e.key === 'N') {
        const x = window.innerWidth / 2 - 75; // Center horizontally
        const y = window.innerHeight / 2 - 25; // Center vertically
        addNode({ x, y, content: 'New Main Node' });
      }

      // Delete Node (Delete)
      if (e.key === 'Delete' && selectedNodeId) {
        removeNode(selectedNodeId);
        setSelectedNodeId(null);
      }

      // Add Child Node (Tab)
      if (e.key === 'Tab' && selectedNodeId) {
        addChildNode(selectedNodeId);
      }

      // Search (Cmd+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' || e.key === 'K') {
        setSearchQuery('');
        setSearchResults([]);
        setCurrentResultIndex(-1);
      }

      // Search navigation
      if (searchResults.length > 0) {
        if (e.key === 'Enter' && e.shiftKey) {
          // Shift+Enter: previous result
          navigateToResult(-1);
        } else if (e.key === 'Enter') {
          // Enter: next result
          navigateToResult(1);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, searchResults, currentResultIndex]);

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
    focusOnNode,
  };

  return (
    <MindMapContext.Provider value={contextValue}>
      {children}
    </MindMapContext.Provider>
  );
};