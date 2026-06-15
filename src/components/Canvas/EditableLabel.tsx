"use client";
import { useEffect, useRef, useState } from "react";
import { useReactFlow } from "@xyflow/react";
interface EditableLabelProps { nodeId: string; label: string; className?: string; }
export function EditableLabel({ nodeId, label, className }: EditableLabelProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setNodes } = useReactFlow();
  useEffect(() => {
    if (!editing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft(label);
    }
  }, [label, editing]);
  const enter = (e: React.MouseEvent) => { e.stopPropagation(); setDraft(label); setEditing(true); };
  const commit = () => {
    setEditing(false);
    const t = draft.trim(); if (!t) { setDraft(label); return; }
    setNodes((ns) => ns.map((n) => n.id === nodeId ? { ...n, data: { ...(n.data as Record<string, unknown>), label: t } } : n));
  };
  if (editing) return (
    <input ref={inputRef} autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
      onBlur={commit} onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } if (e.key === "Escape") { setEditing(false); setDraft(label); } }}
      className={`nodrag nopan w-full bg-transparent text-center outline-none ${className ?? ""}`} />
  );
  return <div onDoubleClick={enter} title="Double-click to rename" className={`cursor-default select-none ${className ?? ""}`}>{label}</div>;
}
