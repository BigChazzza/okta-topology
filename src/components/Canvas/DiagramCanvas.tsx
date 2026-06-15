"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ConnectionMode, Controls, type Connection, type Edge, type EdgeTypes,
  MarkerType, MiniMap, type Node, type NodeTypes, type OnConnect,
  type OnEdgesChange, type OnNodesChange, ReactFlow, addEdge, useReactFlow,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { OktaComponentNode } from "./nodes/OktaComponentNode";
import { OktaLogoNode } from "./nodes/OktaLogoNode";
import { CustomerNode } from "./nodes/CustomerNode";
import { ResourceNode } from "./nodes/ResourceNode";
import { LabeledEdge } from "./edges/LabeledEdge";
import { ContextMenu, type ContextMenuState } from "./ContextMenu";
import { getComponentDefinition } from "@/lib/componentRegistry";
import { DRAG_MIME } from "@/lib/dragMime";
import type { DiagramEdgeData, DiagramNodeData, VisibilityMap } from "@/lib/types";

const nodeTypes: NodeTypes = { "okta-component": OktaComponentNode, "okta-logo": OktaLogoNode, customer: CustomerNode, resource: ResourceNode };
const edgeTypes: EdgeTypes = { labeled: LabeledEdge };
const defaultEdge = { type: "labeled", markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b", width: 18, height: 18 } };

interface Props {
  nodes: Node<DiagramNodeData>[]; edges: Edge<DiagramEdgeData>[]; visibility: VisibilityMap;
  onNodesChange: OnNodesChange<Node<DiagramNodeData>>; onEdgesChange: OnEdgesChange<Edge<DiagramEdgeData>>;
  setNodes: React.Dispatch<React.SetStateAction<Node<DiagramNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<DiagramEdgeData>[]>>;
}

export function DiagramCanvas({ nodes, edges, visibility, onNodesChange, onEdgesChange, setNodes, setEdges }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [menu, setMenu] = useState<ContextMenuState | null>(null);

  const visNodes = useMemo(() => nodes.map((n) => ({ ...n, hidden: !visibility[(n.data as DiagramNodeData).category] })), [nodes, visibility]);
  const hiddenIds = useMemo(() => { const s = new Set<string>(); visNodes.forEach((n) => { if (n.hidden) s.add(n.id); }); return s; }, [visNodes]);
  const visEdges = useMemo(() => edges.map((e) => ({ ...e, hidden: hiddenIds.has(e.source) || hiddenIds.has(e.target) })), [edges, hiddenIds]);

  const onConnect = useCallback<OnConnect>((c: Connection) => {
    setEdges((es) => addEdge({ ...c, id: `e-${nanoid(8)}`, type: "labeled", markerEnd: defaultEdge.markerEnd }, es));
  }, [setEdges]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData(DRAG_MIME); if (!id) return;
    const def = getComponentDefinition(id); if (!def || def.nodeType === "okta-logo") return;
    const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setNodes((ns) => [...ns, { id: `${def.id}-${nanoid(6)}`, type: def.nodeType, position: pos, data: { componentId: def.id, category: def.category, label: def.label } }]);
  }, [screenToFlowPosition, setNodes]);

  return (
    <div ref={wrapRef} className="relative h-full w-full" onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={onDrop}>
      <ReactFlow
        nodes={visNodes} edges={visEdges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdge} connectionMode={ConnectionMode.Loose}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
        onNodeContextMenu={(e, n) => { e.preventDefault(); setMenu({ type: "node", id: n.id, x: e.clientX, y: e.clientY }); }}
        onEdgeContextMenu={(e, ed) => { e.preventDefault(); setMenu({ type: "edge", id: ed.id, x: e.clientX, y: e.clientY }); }}
        onPaneClick={() => setMenu(null)}
        fitView fitViewOptions={{ padding: 0.25, maxZoom: 1.2 }} proOptions={{ hideAttribution: true }}>
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap pannable zoomable position="bottom-left"
          nodeColor={(n) => getComponentDefinition((n.data as DiagramNodeData)?.componentId)?.color ?? "#94a3b8"}
          className="rounded-lg !border-slate-300 dark:!border-slate-600" />
      </ReactFlow>
      <ContextMenu menu={menu} onClose={() => setMenu(null)} />
    </div>
  );
}
