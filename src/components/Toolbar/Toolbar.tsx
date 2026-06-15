"use client";
import { Download, Image as ImageIcon, LayoutDashboard, RotateCcw, Upload } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { Edge, Node } from "@xyflow/react";
import { Button } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { parseImportedDiagram } from "@/lib/persistence";
import type { CustomerConfig, DiagramEdgeData, DiagramNodeData, SerializedDiagram, VisibilityMap } from "@/lib/types";
interface Props {
  nodes: Node<DiagramNodeData>[]; edges: Edge<DiagramEdgeData>[]; visibility: VisibilityMap; customer: CustomerConfig;
  onLoad: (d: SerializedDiagram) => void; onReset: () => void; onAutoLayout: () => void;
  onExportImage: (f: "png" | "svg") => void; onError: (m: string) => void;
}
export function Toolbar({ nodes, edges, visibility, customer, onLoad, onReset, onAutoLayout, onExportImage, onError }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const exportJson = () => {
    const p: SerializedDiagram = {
      version: 1,
      nodes: nodes.map((n) => ({ id: n.id, type: n.type ?? "okta-component", position: n.position, data: n.data as DiagramNodeData })),
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle ?? undefined, targetHandle: e.targetHandle ?? undefined, data: e.data, label: typeof e.label === "string" ? e.label : undefined })),
      visibility, customer,
    };
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }));
    a.download = `okta-topology-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };
  const importFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = ""; if (!f) return;
    try { onLoad(parseImportedDiagram(await f.text())); }
    catch (err) { onError(err instanceof Error ? err.message : "Could not parse file."); }
  };
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900">
      <Image src="/okta-logo.svg" alt="Okta" width={96} height={51} priority draggable={false} className="h-9 w-auto dark:invert" />
      <div className="flex items-center gap-2">
        <Button onClick={onAutoLayout} title="Auto-arrange nodes"><LayoutDashboard size={14} /><span className="hidden sm:inline">Auto Layout</span></Button>
        <Button onClick={() => onExportImage("png")} title="Export PNG"><ImageIcon size={14} /><span className="hidden sm:inline">PNG</span></Button>
        <Button onClick={() => onExportImage("svg")} title="Export SVG"><ImageIcon size={14} /><span className="hidden sm:inline">SVG</span></Button>
        <Button onClick={() => fileRef.current?.click()} title="Import JSON"><Upload size={14} /><span className="hidden sm:inline">Import</span></Button>
        <Button onClick={exportJson} title="Export JSON"><Download size={14} /><span className="hidden sm:inline">Export</span></Button>
        <Button onClick={() => window.confirm("Reset diagram to defaults?") && onReset()} variant="ghost"><RotateCcw size={14} /><span className="hidden sm:inline">Reset</span></Button>
        <ThemeToggle />
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={importFile} />
      </div>
    </header>
  );
}
