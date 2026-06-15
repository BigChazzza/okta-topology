import Dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";

const DEFAULT_NODE_W = 200;
const DEFAULT_NODE_H = 80;

export function applyAutoLayout<N extends Node, E extends Edge>(
  nodes: N[],
  edges: E[],
  direction: "LR" | "TB" = "LR",
): N[] {
  if (nodes.length === 0) return nodes;
  const g = new Dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, ranksep: 80, nodesep: 48, edgesep: 24 });
  nodes.forEach((n) => {
    const w = (n.measured as { width?: number } | undefined)?.width ?? DEFAULT_NODE_W;
    const h = (n.measured as { height?: number } | undefined)?.height ?? DEFAULT_NODE_H;
    g.setNode(n.id, { width: w, height: h });
  });
  edges.forEach((e) => {
    if (g.hasNode(e.source) && g.hasNode(e.target)) g.setEdge(e.source, e.target);
  });
  Dagre.layout(g);
  return nodes.map((n) => {
    const pos = g.node(n.id);
    if (!pos) return n;
    const w = (n.measured as { width?: number } | undefined)?.width ?? DEFAULT_NODE_W;
    const h = (n.measured as { height?: number } | undefined)?.height ?? DEFAULT_NODE_H;
    return { ...n, position: { x: pos.x - w / 2, y: pos.y - h / 2 } };
  });
}
