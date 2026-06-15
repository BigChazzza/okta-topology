export type CategoryKey =
  | "customer"
  | "resources"
  | "core-identity"
  | "customer-identity"
  | "workforce"
  | "privileged-access"
  | "governance"
  | "integrations"
  | "security"
  | "okta-logo";

export type NodeKind =
  | "okta-component"
  | "resource"
  | "external"
  | "okta-logo"
  | "customer";

export type LucideIconName = "user" | "users" | "building-2";

export interface ComponentDefinition {
  id: string;
  label: string;
  category: CategoryKey;
  lucideIcon?: LucideIconName;
  fallbackMonogram: string;
  color: string;
  nodeType: NodeKind;
}

export interface DiagramNodeData {
  componentId: string;
  category: CategoryKey;
  label: string;
  [key: string]: unknown;
}

export interface DiagramEdgeData {
  label?: string;
  [key: string]: unknown;
}

export interface SerializedNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: DiagramNodeData;
}

export interface SerializedEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  data?: DiagramEdgeData;
  label?: string;
}

export type VisibilityMap = Record<CategoryKey, boolean>;

export interface CustomerConfig {
  name?: string;
  logoDataUrl?: string;
  logoUrl?: string;
}

export interface SerializedDiagram {
  version: 1;
  nodes: SerializedNode[];
  edges: SerializedEdge[];
  visibility: VisibilityMap;
  customer?: CustomerConfig;
}
