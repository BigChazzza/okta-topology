import Dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";

const DEFAULT_NODE_W = 212;
const DEFAULT_NODE_H = 80;

function nodeSize(n: Node): { w: number; h: number } {
  return {
    w: (n.measured as { width?: number } | undefined)?.width ?? DEFAULT_NODE_W,
    h: (n.measured as { height?: number } | undefined)?.height ?? DEFAULT_NODE_H,
  };
}

/**
 * Given the centre-to-centre vector from source to target, return the handle
 * pair that produces the straightest possible edge:
 *   - Primarily horizontal → exit right/left, enter left/right
 *   - Primarily vertical   → exit bottom/top, enter top/bottom
 */
function optimalHandles(
  sx: number, sy: number,
  tx: number, ty: number,
): { sourceHandle: string; targetHandle: string } {
  const dx = tx - sx;
  const dy = ty - sy;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { sourceHandle: "right", targetHandle: "left" }
      : { sourceHandle: "left",  targetHandle: "right" };
  }
  return dy >= 0
    ? { sourceHandle: "bottom", targetHandle: "top" }
    : { sourceHandle: "top",    targetHandle: "bottom" };
}

export function applyAutoLayout<N extends Node, E extends Edge>(
  nodes: N[],
  edges: E[],
  direction: "LR" | "TB" = "TB",
): { nodes: N[]; edges: E[] } {
  if (nodes.length === 0) return { nodes, edges };

  const g = new Dagre.graphlib.Graph({ multigraph: false, compound: false });
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    ranker: "network-simplex",
    acyclicer: "greedy",
    align: "UL",
    ranksep: 140,
    nodesep: 100,
    edgesep: 60,
    marginx: 60,
    marginy: 60,
  });

  nodes.forEach((n) => {
    const { w, h } = nodeSize(n);
    g.setNode(n.id, { width: w, height: h });
  });
  edges.forEach((e) => {
    if (g.hasNode(e.source) && g.hasNode(e.target)) g.setEdge(e.source, e.target);
  });

  Dagre.layout(g);

  // Dagre stores the node centre — capture it for handle assignment below
  const centres = new Map<string, { x: number; y: number }>();
  nodes.forEach((n) => {
    const pos = g.node(n.id);
    if (pos) centres.set(n.id, { x: pos.x, y: pos.y });
  });

  const newNodes = nodes.map((n) => {
    const pos = g.node(n.id);
    if (!pos) return n;
    const { w, h } = nodeSize(n);
    return { ...n, position: { x: pos.x - w / 2, y: pos.y - h / 2 } };
  });

  // Re-assign each edge's handles based on the post-layout relative positions
  // so every connection exits and enters from the side that keeps it straightest
  const newEdges = edges.map((e) => {
    const sc = centres.get(e.source);
    const tc = centres.get(e.target);
    if (!sc || !tc) return e;
    const { sourceHandle, targetHandle } = optimalHandles(sc.x, sc.y, tc.x, tc.y);
    return { ...e, sourceHandle, targetHandle };
  });

  return { nodes: newNodes, edges: newEdges as E[] };
}
