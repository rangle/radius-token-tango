export const isFrame = (n: BaseNode | null): n is FrameNode =>
  !!n && n.type === "FRAME";
export const isInstance = (n: BaseNode | null): n is InstanceNode =>
  !!n && n.type === "INSTANCE";
export const isComponent = (n: BaseNode | null): n is ComponentNode =>
  !!n && n.type === "COMPONENT";
export const isComponentSet = (n: BaseNode | null): n is ComponentSetNode =>
  !!n && n.type === "COMPONENT_SET";
export const isGroup = (n: BaseNode | null): n is GroupNode =>
  !!n && n.type === "GROUP";

export type Composite =
  | FrameNode
  | InstanceNode
  | ComponentNode
  | ComponentSetNode
  | GroupNode;

export const isComposite = (n: SceneNode): n is Composite =>
  isFrame(n) ||
  isInstance(n) ||
  isComponent(n) ||
  isComponentSet(n) ||
  isGroup(n);
