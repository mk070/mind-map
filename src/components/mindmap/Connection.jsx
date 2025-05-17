import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

const Connection = ({ connection, nodes }) => {
  const { lineThickness } = useSettingsStore();
  const pathRef = useRef(null);
  
  const fromNode = nodes.find(node => node.id === connection.from);
  const toNode = nodes.find(node => node.id === connection.to);

  // Debug log
  useEffect(() => {
    console.log('Connection debug:', {
      connection,
      fromNode: fromNode ? { id: fromNode.id, x: fromNode.x, y: fromNode.y } : null,
      toNode: toNode ? { id: toNode.id, x: toNode.x, y: toNode.y } : null,
      nodesCount: nodes.length,
      hasFromNode: !!fromNode,
      hasToNode: !!toNode
    });
  }, [connection, fromNode, toNode, nodes.length]);
  
  if (!fromNode || !toNode) {
    console.log('Skipping connection - missing nodes');
    return null;
  }
  
  // Simple straight line for now
  const fromX = fromNode.x + 120; // Right edge of parent
  const fromY = fromNode.y + 20;  // Vertical center
  const toX = toNode.x;           // Left edge of child
  const toY = toNode.y + 20;      // Vertical center
  
  const path = `M ${fromX} ${fromY} L ${toX} ${toY}`;
  
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'visible'
      }}
    >
      <path
        ref={pathRef}
        d={path}
        stroke="#ff0000"  // Bright red for visibility
        strokeWidth={lineThickness || 2}
        fill="none"
        strokeDasharray="none"
      />
      
      {/* Arrow at the end of the line */}
      <circle 
        cx={toX} 
        cy={toY} 
        r={3} 
        fill="#ff0000"
      />
    </svg>
  );
};

export default Connection;