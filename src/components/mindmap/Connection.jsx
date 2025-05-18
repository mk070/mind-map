import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

const Connection = ({ connection, nodes }) => {
  const { lineThickness, lineStyle } = useSettingsStore();
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
      hasToNode: !!toNode,
      lineStyle,
      lineThickness
    });
  }, [connection, fromNode, toNode, nodes.length, lineStyle, lineThickness]);
  
  if (!fromNode || !toNode) {
    console.log('Skipping connection - missing nodes');
    return null;
  }
  
  // Calculate connection points
  const fromX = fromNode.x + 120; // Right edge of parent
  const fromY = fromNode.y + 20;  // Vertical center
  const toX = toNode.x;           // Left edge of child
  const toY = toNode.y + 20;      // Vertical center

  // Generate path based on line style
  let path;
  switch (lineStyle) {
    case 'bezier':
      // Create a more noticeable bezier curve
      const curveHeight = Math.abs(toY - fromY) * 0.5;
      const curveDirection = toY > fromY ? -1 : 1;
      const controlX = (fromX + toX) / 2;
      const controlY = fromY + curveHeight * curveDirection;
      path = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;
      break;
    
    case 'curved':
      // Create a more pronounced curved line
      const curveOffset = Math.abs(toY - fromY) * 0.3;
      const curveX = (fromX + toX) / 2;
      const curveY1 = fromY < toY ? fromY - curveOffset : fromY + curveOffset;
      const curveY2 = fromY < toY ? toY + curveOffset : toY - curveOffset;
      path = `M ${fromX} ${fromY} C ${fromX} ${curveY1}, ${curveX} ${curveY2}, ${toX} ${toY}`;
      break;
    
    default: // straight
      path = `M ${fromX} ${fromY} L ${toX} ${toY}`;
  }

  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'visible',
        pointerEvents: 'none'
      }}
    >
      <path
        ref={pathRef}
        d={path}
        stroke="#ff0000"
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