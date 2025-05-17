import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMindMap } from '../../context/MindMapContext';
import Node from './Node';
import Connection from './Connection';
import Controls from './Controls';
import { useSettingsStore } from '../../store/settingsStore';

const Canvas = () => {
  const { 
    nodes, 
    connections,
    updateNodePosition,
    canvasRef,
    scale,
    position,
    setCanvasPosition,
    draggingNodeRef,
    startDraggingNode,
    stopDraggingNode,
    zoomIn,
    zoomOut
  } = useMindMap();
  
  const { snapToGrid } = useSettingsStore();
  const isDraggingCanvas = useRef(false);
  
  // Debug log connections and nodes
  useEffect(() => {
    console.log('Canvas state:', {
      nodes: nodes.map(n => ({ id: n.id, x: n.x, y: n.y, parentId: n.parentId })),
      connections: [...connections],
      nodesCount: nodes.length,
      connectionsCount: connections.length
    });
  }, [nodes, connections]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 5000, height: 5000 });
  
  // Update canvas size based on nodes position
  useEffect(() => {
    if (nodes.length === 0) return;
    
    const padding = 1000;
    const minX = Math.min(...nodes.map(node => node.x)) - padding;
    const maxX = Math.max(...nodes.map(node => node.x)) + padding;
    const minY = Math.min(...nodes.map(node => node.y)) - padding;
    const maxY = Math.max(...nodes.map(node => node.y)) + padding;
    
    setCanvasSize({
      width: Math.max(5000, maxX - minX),
      height: Math.max(5000, maxY - minY),
    });
  }, [nodes]);
  
  const handleMouseDown = (e) => {
    // Only start canvas drag if clicking on the canvas itself, not on a node
    if (e.target === e.currentTarget || e.target.closest('.canvas-bg')) {
      isDraggingCanvas.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      document.body.style.cursor = 'grabbing';
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDraggingCanvas.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      
      setCanvasPosition({
        x: position.x + dx / scale,
        y: position.y + dy / scale
      });
      
      lastMousePos.current = {
        x: e.clientX,
        y: e.clientY
      };
    }
  };
  
  const handleMouseUp = () => {
    isDraggingCanvas.current = false;
    stopDraggingNode();
  };
  
  const handleNodeDrag = useCallback((id, x, y) => {
    if (snapToGrid) {
      x = Math.round(x / 32) * 32;
      y = Math.round(y / 32) * 32;
    }
    updateNodePosition(id, x, y);
  }, [snapToGrid, updateNodePosition]);

  // Create a stable drag handler function
  const createDragHandler = useCallback((nodeId) => {
    return (x, y) => {
      startDraggingNode(nodeId);
      handleNodeDrag(nodeId, x, y);
    };
  }, [startDraggingNode, handleNodeDrag]);

  // Store drag handlers by node ID to prevent recreating them on each render
  const nodeHandlers = useRef({});

  // Initialize handlers for new nodes
  useEffect(() => {
    nodes.forEach(node => {
      if (!nodeHandlers.current[node.id]) {
        nodeHandlers.current[node.id] = createDragHandler(node.id);
      }
    });
  }, [nodes, createDragHandler]);

  // Clean up handlers for removed nodes
  useEffect(() => {
    const currentIds = new Set(nodes.map(node => node.id));
    Object.keys(nodeHandlers.current).forEach(id => {
      if (!currentIds.has(id)) {
        delete nodeHandlers.current[id];
      }
    });
  }, [nodes]);
  
  // Handle zooming with mouse wheel using a non-passive event listener
  const handleWheel = useCallback((e) => {
    e.preventDefault(); // Works because we set passive: false in the event listener
    
    // Adjust position to zoom toward mouse position
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const mouseXInCanvas = mouseX / scale - position.x;
    const mouseYInCanvas = mouseY / scale - position.y;
    
    // Calculate new scale based on wheel direction
    const newScale = e.deltaY < 0 ? scale + 0.1 : scale - 0.1;
    
    // Clamp scale between 0.5 and 2
    const clampedScale = Math.min(Math.max(newScale, 0.5), 2);
    
    const newX = mouseX / clampedScale - mouseXInCanvas;
    const newY = mouseY / clampedScale - mouseYInCanvas;
    
    // Use the existing zoom functions
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
    
    setCanvasPosition({ x: newX, y: newY });
  }, [scale, position, setCanvasPosition, canvasRef, zoomIn, zoomOut]);
  
  // Setup non-passive wheel event listener
  useEffect(() => {
    const wheelHandler = (e) => handleWheel(e);
    const canvas = canvasRef.current;
    
    if (canvas) {
      canvas.addEventListener('wheel', wheelHandler, { passive: false });
      
      return () => {
        canvas.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [handleWheel, canvasRef]);
  
  return (
    <div 
      className="relative flex-1 overflow-hidden touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      // onWheel handled by addEventListener with { passive: false }
    >
      <div 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full overflow-visible canvas-bg"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: '0 0',
          pointerEvents: 'auto' // Ensure canvas can receive events
        }}
      >
        {/* Connection Layer - Behind everything */}
        <div className="connection-layer" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none', // Allow clicks to pass through to nodes/canvas
          overflow: 'visible'
        }}>
          {connections.map(connection => (
            <Connection
              key={`${connection.from}-${connection.to}`}
              connection={connection}
              nodes={nodes}
            />
          ))}
        </div>
        
        {/* Node Layer - On top of connections */}
        <div className="node-layer" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none' // Let individual nodes handle their own events
        }}>
          {nodes.map(node => (
            <Node
              key={node.id}
              node={node}
              onDrag={nodeHandlers.current[node.id]}
            />
          ))}
        </div>
      </div>
      
      <Controls />
    </div>
  );
};

export default Canvas;