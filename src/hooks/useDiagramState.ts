"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type Edge, type Node, type OnEdgesChange, type OnNodesChange,
  applyEdgeChanges, applyNodeChanges,
} from "@xyflow/react";
import { DEFAULT_VISIBILITY, INITIAL_NODES } from "@/lib/initialState";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/persistence";
import { getComponentDefinition } from "@/lib/componentRegistry";
import type { CustomerConfig, DiagramEdgeData, DiagramNodeData, SerializedDiagram, VisibilityMap } from "@/lib/types";

const DEBOUNCE = 250;
type DN = Node<DiagramNodeData>;
type DE = Edge<DiagramEdgeData>;

function toNode(s: SerializedDiagram["nodes"][number]): DN {
  const def = getComponentDefinition(s.data.componentId);
  const data = def ? { ...s.data, category: def.category } : s.data;
  return { id: s.id, type: s.type, position: s.position, data };
}

function toEdge(s: SerializedDiagram["edges"][number]): DE {
  return {
    id: s.id, source: s.source, target: s.target,
    sourceHandle: s.sourceHandle ?? undefined,
    targetHandle: s.targetHandle ?? undefined,
    data: s.data, label: s.label, type: "labeled",
  };
}

function serialize(nodes: DN[], edges: DE[], visibility: VisibilityMap, customer: CustomerConfig): SerializedDiagram {
  return {
    version: 1,
    nodes: nodes.map((n) => ({ id: n.id, type: n.type ?? "okta-component", position: n.position, data: n.data as DiagramNodeData })),
    edges: edges.map((e) => ({
      id: e.id, source: e.source, target: e.target,
      sourceHandle: e.sourceHandle ?? undefined, targetHandle: e.targetHandle ?? undefined,
      data: e.data, label: typeof e.label === "string" ? e.label : undefined,
    })),
    visibility, customer,
  };
}

export interface UseDiagramStateResult {
  nodes: DN[]; edges: DE[]; visibility: VisibilityMap; customer: CustomerConfig; hydrated: boolean;
  setNodes: React.Dispatch<React.SetStateAction<DN[]>>;
  setEdges: React.Dispatch<React.SetStateAction<DE[]>>;
  onNodesChange: OnNodesChange<DN>; onEdgesChange: OnEdgesChange<DE>;
  setVisibility: React.Dispatch<React.SetStateAction<VisibilityMap>>;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerConfig>>;
  loadDiagram: (d: SerializedDiagram) => void;
  resetDiagram: () => void;
}

export function useDiagramState(): UseDiagramStateResult {
  const [nodes, setNodes] = useState<DN[]>([]);
  const [edges, setEdges] = useState<DE[]>([]);
  const [visibility, setVisibility] = useState<VisibilityMap>(DEFAULT_VISIBILITY);
  const [customer, setCustomer] = useState<CustomerConfig>({});
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const stored = loadFromLocalStorage();
    if (stored) {
      setNodes(stored.nodes.map(toNode));
      setEdges(stored.edges.map(toEdge));
      setVisibility(stored.visibility);
      if (stored.customer) setCustomer(stored.customer);
    } else {
      setNodes(INITIAL_NODES.map(toNode));
      setVisibility(DEFAULT_VISIBILITY);
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => saveToLocalStorage(serialize(nodes, edges, visibility, customer)), DEBOUNCE);
    return () => window.clearTimeout(id);
  }, [nodes, edges, visibility, customer, hydrated]);

  const onNodesChange: OnNodesChange<DN> = useCallback((c) => setNodes((cur) => applyNodeChanges(c, cur)), []);
  const onEdgesChange: OnEdgesChange<DE> = useCallback((c) => setEdges((cur) => applyEdgeChanges(c, cur)), []);
  const loadDiagram = useCallback((d: SerializedDiagram) => {
    setNodes(d.nodes.map(toNode)); setEdges(d.edges.map(toEdge));
    setVisibility(d.visibility); setCustomer(d.customer ?? {});
  }, []);
  const resetDiagram = useCallback(() => {
    setNodes(INITIAL_NODES.map(toNode)); setEdges([]); setVisibility(DEFAULT_VISIBILITY); setCustomer({});
  }, []);

  return { nodes, edges, visibility, customer, hydrated, setNodes, setEdges, onNodesChange, onEdgesChange, setVisibility, setCustomer, loadDiagram, resetDiagram };
}
