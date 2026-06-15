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

export function applyAutoLayout<N extends Node, E extends Edge>(
  nodes: N[],
  edges: E[],
  direction: "LR" | "TB" = "TB",
): N[] {
  if (nodes.length === 0) return nodes;

  const g = new Dagre.graphlib.Graph({ multigraph: false, compound: false });
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    // network-simplex produces the fewest edge crossings of dagre's three rankers
    ranker: "network-simplex",
    // greedy acyclicer handles diagrams where connections loop back
    acyclicer: "greedy",
    // generous spacing gives the router room to separate parallel edges
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
    if (g.hasNode(e.source) && g.hasNode(e.target)) {
      g.setEdge(e.source, e.target);
    }
  });

  Dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    if (!pos) return n;
    const { w, h } = nodeSize(n);
    return { ...n, position: { x: pos.x - w / 2, y: pos.y - h / 2 } };
  });
}
