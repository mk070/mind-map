import React, { useEffect, useRef } from 'react';
import { getBezierPath } from '../../utils/helpers';
import { useSettingsStore } from '../../store/settingsStore';
import { gsap } from 'gsap';

const Connection = ({ connection, nodes }) => {
  const { lineStyle, lineThickness, animationsEnabled } = useSettingsStore();
  const pathRef = useRef(null);
  
  const fromNode = nodes.find(node => node.id === connection.from);
  const toNode = nodes.find(node => node.id === connection.to);
  
  // Apply line drawing animation on first render
  useEffect(() => {
    if (!pathRef.current || !animationsEnabled) return;
    
    gsap.effects.connectionDraw(pathRef.current);
  }, [animationsEnabled]);
  
  if (!fromNode || !toNode) return null;
  
  // Calculate connection points
  // For parent node, connect from right edge to child's left edge
  const fromX = fromNode.x + 150;  // Right edge of parent
  const fromY = fromNode.y + 25;   // Vertical center
  const toX = toNode.x;            // Left edge of child
  const toY = toNode.y + 25;       // Vertical center
  
  let path;
  
  switch (lineStyle) {
    case 'straight':
      path = `M ${fromX} ${fromY} L ${toX} ${toY}`;
      break;
    case 'curved':
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      path = `M ${fromX} ${fromY} Q ${midX} ${midY}, ${toX} ${toY}`;
      break;
    case 'bezier':
    default:
      path = getBezierPath(fromX, fromY, toX, toY);
      break;
  }
  
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 1,  // Ensure lines appear behind nodes
        overflow: 'visible'  // Allow lines to be visible outside container
      }}
    >
      <path
        ref={pathRef}
        d={path}
        stroke="#94a3b8"  // Default line color
        strokeWidth={lineThickness || 2}
        fill="none"
        strokeDasharray={lineStyle === 'dashed' ? '5,5' : 'none'}
        className="text-primary-500/70 dark:text-primary-400/70"
      />
      
      {/* Arrow at the end of the line */}
      <circle 
        cx={toX} 
        cy={toY} 
        r={3} 
        className="fill-primary-500 dark:fill-primary-400"
      />
    </svg>
  );
};

export default Connection;