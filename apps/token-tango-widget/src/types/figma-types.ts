const { widget } = figma;

/**
 * Re-export Figma widget's useSyncedState hook
 */
export const { useSyncedState, waitForTask } = widget;

/**
 * Type for Figma's useSyncedState hook
 */
export type UseSyncedState<T> = [T, (newValue: T) => void];

/**
 * Type guard for Figma component nodes
 */
export const isComponent = (node: SceneNode): node is ComponentNode => {
  return node.type === "COMPONENT";
};

/**
 * Type guard for Figma instance nodes
 */
export const isInstance = (node: SceneNode): node is InstanceNode => {
  return node.type === "INSTANCE";
};

/**
 * Type guard for Figma frame nodes
 */
export const isFrame = (node: SceneNode): node is FrameNode => {
  return node.type === "FRAME";
};

/**
 * Type guard for Figma vector nodes
 */
export const isVector = (node: SceneNode): node is VectorNode => {
  return node.type === "VECTOR";
};

/**
 * Type guard for composite nodes (nodes that can have children)
 */
export const isComposite = (
  node: SceneNode,
): node is ComponentNode | InstanceNode | FrameNode => {
  return isComponent(node) || isInstance(node) || isFrame(node);
}; 