"use client";
import { useEffect, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
export interface ContextMenuState { type: "node" | "edge"; id: string; x: number; y: number; }
export function ContextMenu({ menu, onClose }: { menu: ContextMenuState | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setNodes, setEdges, getEdges } = useReactFlow();
  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("mousedown", close); window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("mousedown", close); window.removeEventListener("keydown", esc); };
  }, [menu, onClose]);
  if (!menu) return null;
  const remove = () => {
    if (menu.type === "node") { setNodes((ns) => ns.filter((n) => n.id !== menu.id)); setEdges((es) => es.filter((e) => e.source !== menu.id && e.target !== menu.id)); }
    else setEdges((es) => es.filter((e) => e.id !== menu.id));
    onClose();
  };
  const relabel = () => {
    const edge = getEdges().find((e) => e.id === menu.id); if (!edge) return;
    const next = window.prompt("Label:", typeof edge.label === "string" ? edge.label : "");
    if (next === null) { onClose(); return; }
    const t = next.trim();
    setEdges((es) => es.map((e) => e.id === menu.id ? { ...e, label: t.length ? t : undefined } : e));
    onClose();
  };
  return (
    <div ref={ref} role="menu" style={{ left: menu.x, top: menu.y }}
      className="fixed z-50 min-w-[160px] overflow-hidden rounded-lg border border-slate-200 bg-white text-sm shadow-xl dark:border-slate-700 dark:bg-slate-800">
      {menu.type === "edge" && <button type="button" onClick={relabel} className="block w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-700">Edit label…</button>}
      <button type="button" onClick={remove} className="block w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40">Delete</button>
    </div>
  );
}
