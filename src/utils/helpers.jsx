// Simple nanoid implementation for generating unique IDs
export const nanoid = () => {
  return Math.random().toString(36).substring(2, 12);
};

// Calculate bezier curve control points for a smooth curve
export const getBezierPath = (startX, startY, endX, endY) => {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Calculate control points for the bezier curve
  const dx = Math.abs(endX - startX) * 0.5;
  
  const controlPoint1X = startX + dx;
  const controlPoint1Y = startY;
  
  const controlPoint2X = endX - dx;
  const controlPoint2Y = endY;
  
  return `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;
};

// Map value from one range to another
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

// Snap value to grid
export const snapToGrid = (value, gridSize = 32) => {
  return Math.round(value / gridSize) * gridSize;
};

// Deep clone an object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Convert color name to theme class
export const getColorClass = (color = 'primary', element = 'bg') => {
  const colorMap = {
    primary: `${element}-primary-500`,
    secondary: `${element}-secondary-500`,
    success: `${element}-success-500`,
    warning: `${element}-warning-500`,
    danger: `${element}-danger-500`,
    ai: `${element}-ai-500`,
  };
  
  return colorMap[color] || colorMap.primary;
};

// Get contrast text color based on background
export const getContrastText = (color) => {
  const lightColors = ['success', 'warning', 'ai'];
  return lightColors.includes(color) ? 'text-surface-dark' : 'text-surface-light';
};