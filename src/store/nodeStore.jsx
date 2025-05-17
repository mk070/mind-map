import { create } from 'zustand';
import { nanoid } from '../utils/helpers';

export const useNodeStore = create((set, get) => ({
  nodes: [],
  connections: [],
  
  addNode: ({ x = 0, y = 0, content = 'New Node', color = 'primary', parentId = null }) => {
    let newNodeId = nanoid();
    
    set(state => {
      // If this is a child node, position it relative to its parent
      if (parentId) {
        const parent = state.nodes.find(n => n.id === parentId);
        if (parent) {
          const children = state.getNodeChildren(parentId);
          x = parent.x + 200; // Offset child to the right of parent
          y = parent.y + (children.length * 80 - 40); // Stack children vertically with 80px spacing
        }
      } else {
        // Position new main nodes with an offset from existing ones
        const mainNodes = state.nodes.filter(node => !node.parentId);
        if (mainNodes.length > 0) {
          // Find the bottom-most main node
          const bottomNode = mainNodes.reduce((bottom, node) => 
            node.y > bottom.y ? node : bottom, mainNodes[0]);
          
          // Position new node below the bottom-most node with some spacing
          x = bottomNode.x;
          y = bottomNode.y + 120; // 120px vertical spacing between main nodes
        } else {
          // First main node
          x = window.innerWidth / 2 - 100; // Center horizontally
          y = window.innerHeight / 2 - 20; // Center vertically
        }
      }

      const newNode = {
        id: newNodeId,
        x,
        y,
        content,
        color,
        parentId
      };
      
      const newConnections = [...state.connections];
      
      // If this has a parent, create a connection
      if (parentId) {
        newConnections.push({
          id: nanoid(),
          from: parentId,
          to: newNodeId
        });
      }
      
      return {
        nodes: [...state.nodes, newNode],
        connections: newConnections
      };
    });
    
    // Return the ID of the new node
    return newNodeId;
  },
  
  updateNode: (id, updates) => {
    set(state => ({
      nodes: state.nodes.map(node => 
        node.id === id ? { ...node, ...updates } : node
      )
    }));
  },
  
  updateNodePosition: (id, x, y) => {
    set(state => ({
      nodes: state.nodes.map(node => 
        node.id === id ? { ...node, x, y } : node
      )
    }));
  },
  
  removeNode: (id) => {
    set(state => {
      // Get all descendant nodes to remove (recursive)
      const getDescendantIds = (nodeId) => {
        const children = state.nodes.filter(n => n.parentId === nodeId);
        return [
          nodeId,
          ...children.flatMap(child => getDescendantIds(child.id))
        ];
      };
      
      const nodeIdsToRemove = getDescendantIds(id);
      
      return {
        nodes: state.nodes.filter(node => !nodeIdsToRemove.includes(node.id)),
        connections: state.connections.filter(
          connection => !nodeIdsToRemove.includes(connection.from) && 
                       !nodeIdsToRemove.includes(connection.to)
        )
      };
    });
  },
  
  getNodeParent: (id) => {
    const { nodes } = get();
    const node = nodes.find(n => n.id === id);
    if (!node || !node.parentId) return null;
    return nodes.find(n => n.id === node.parentId);
  },
  
  getNodeChildren: (id) => {
    const { nodes } = get();
    return nodes.filter(node => node.parentId === id);
  },
  
  clearAll: () => {
    set({ nodes: [], connections: [] });
  }
}));