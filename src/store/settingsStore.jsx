import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  // UI settings
  showSettings: false,
  sidebarOpen: true,
  autoExpandNodes: true,
  animationsEnabled: true,
  showGrid: true,
  snapToGrid: false,
  
  // Mind map settings
  defaultNodeColor: 'primary',
  lineStyle: 'bezier', // 'bezier', 'straight', 'curved'
  lineThickness: 2,
  
  // Actions
  toggleSettings: () => set(state => ({ showSettings: !state.showSettings })),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  toggleAutoExpandNodes: () => set(state => ({ autoExpandNodes: !state.autoExpandNodes })),
  toggleAnimations: () => set(state => ({ animationsEnabled: !state.animationsEnabled })),
  toggleGrid: () => set(state => ({ showGrid: !state.showGrid })),
  toggleSnapToGrid: () => set(state => ({ snapToGrid: !state.snapToGrid })),
  
  setDefaultNodeColor: (color) => set({ defaultNodeColor: color }),
  setLineStyle: (style) => set({ lineStyle: style }),
  setLineThickness: (thickness) => set({ lineThickness: thickness }),
}));