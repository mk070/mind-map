import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

const Connection = ({ connection, nodes }) => {
  const { lineThickness, lineStyle, lineLengthMultiplier } = useSettingsStore();
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

  // Generate path based on line style with optimized calculations
  const generatePath = () => {
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    switch (lineStyle) {
      case 'bezier':
        // Create a natural-looking bezier curve
        const bezierCurveHeight = Math.min(distance * 0.3, 80);
        const bezierCurveDirection = deltaY > 0 ? -1 : 1;
        const bezierControlX = fromX + (deltaX * 0.4 * lineLengthMultiplier);
        const bezierControlY = fromY + (deltaY * 0.4 * lineLengthMultiplier);
        const bezierToX = toX + (deltaX * (lineLengthMultiplier - 1));
        const bezierToY = toY + (deltaY * (lineLengthMultiplier - 1));
        return `M ${fromX} ${fromY} Q ${bezierControlX} ${bezierControlY + bezierCurveHeight * bezierCurveDirection} ${bezierToX} ${bezierToY}`;
      
      case 'curved':
        // Create a natural-looking curved line with multiple control points
        const curveOffset = Math.min(distance * 0.2, 60);
        const curveX1 = fromX + (deltaX * 0.3 * lineLengthMultiplier);
        const curveY1 = fromY + (deltaY * 0.3 * lineLengthMultiplier);
        const curveX2 = toX + (deltaX * 0.3 * (lineLengthMultiplier - 1));
        const curveY2 = toY + (deltaY * 0.3 * (lineLengthMultiplier - 1));
        const curveToX = toX + (deltaX * (lineLengthMultiplier - 1));
        const curveToY = toY + (deltaY * (lineLengthMultiplier - 1));
        
        // Add some variation to make it look more natural
        const curveVariation = Math.random() * 20 - 10;
        const curveY1Var = curveY1 + curveVariation;
        const curveY2Var = curveY2 - curveVariation;
        
        return `M ${fromX} ${fromY} C ${curveX1} ${curveY1Var}, ${curveX2} ${curveY2Var}, ${curveToX} ${curveToY}`;
      
      case 'zigzag':
        // Create a zigzag line with natural variation
        const numZigs = Math.max(2, Math.floor(distance / 50));
        const zigWidth = deltaX / (numZigs * 2);
        const zigHeight = 20 + Math.random() * 5 - 2.5; // Add some variation
        
        let zigPath = `M ${fromX} ${fromY}`;
        for (let i = 0; i < numZigs; i++) {
          const zigVariation = Math.random() * 5 - 2.5;
          const zigX = fromX + (zigWidth * (i * 2 + 1) * lineLengthMultiplier);
          const zigY = fromY + (i % 2 === 0 ? zigHeight + zigVariation : -zigHeight + zigVariation);
          zigPath += ` L ${zigX} ${zigY}`;
          zigPath += ` L ${fromX + (zigWidth * (i * 2 + 2) * lineLengthMultiplier)} ${fromY}`;
        }
        const zigToX = toX + (deltaX * (lineLengthMultiplier - 1));
        const zigToY = toY + (deltaY * (lineLengthMultiplier - 1));
        zigPath += ` L ${zigToX} ${zigToY}`;
        return zigPath;
      
      case 'dashed':
        // For dashed lines, we'll return a regular path and use stroke-dasharray in the SVG
        const dashToX = toX + (deltaX * (lineLengthMultiplier - 1));
        const dashToY = toY + (deltaY * (lineLengthMultiplier - 1));
        return `M ${fromX} ${fromY} L ${dashToX} ${dashToY}`;
      
      default: // straight
        const straightToX = toX + (deltaX * (lineLengthMultiplier - 1));
        const straightToY = toY + (deltaY * (lineLengthMultiplier - 1));
        return `M ${fromX} ${fromY} L ${straightToX} ${straightToY}`;
    }
  };

  const path = generatePath();

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
        strokeDasharray={lineStyle === 'dashed' ? "5,3" : "none"}
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