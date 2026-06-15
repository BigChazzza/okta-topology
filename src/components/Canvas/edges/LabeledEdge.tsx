"use client";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps, useReactFlow } from "@xyflow/react";
export function LabeledEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, selected, markerEnd, style } = props;
  const { setEdges } = useReactFlow();
  const [path, lx, ly] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 8 });
  const edit = () => {
    const next = window.prompt("Label this connection:", typeof label === "string" ? label : "");
    if (next === null) return;
    const t = next.trim();
    setEdges((es) => es.map((e) => e.id === id ? { ...e, label: t.length ? t : undefined, data: { ...(e.data ?? {}), label: t.length ? t : undefined } } : e));
  };
  const stroke = selected ? "#007DC1" : "#64748b";
  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ stroke, strokeWidth: selected ? 2.5 : 1.75, ...style }} />
      <EdgeLabelRenderer>
        <div onDoubleClick={edit} className="nodrag nopan absolute pointer-events-auto"
          style={{ transform: `translate(-50%,-50%) translate(${lx}px,${ly}px)` }}>
          {label ? (
            <span className="rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm" style={{ background: "#0f172a" }}>{label}</span>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
