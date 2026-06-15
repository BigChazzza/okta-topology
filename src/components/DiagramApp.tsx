"use client";
import { useCallback, useEffect } from "react";
import { ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { toPng, toSvg } from "html-to-image";
import { DiagramCanvas } from "./Canvas/DiagramCanvas";
import { Sidebar } from "./Sidebar/Sidebar";
import { Toolbar } from "./Toolbar/Toolbar";
import { ToastStack } from "./ToastStack";
import { CustomerProvider } from "@/contexts/CustomerContext";
import { useDiagramState } from "@/hooks/useDiagramState";
import { useToast } from "@/hooks/useToast";
import { applyAutoLayout } from "@/lib/autoLayout";
import { parseImportedDiagram, clearStoredDiagram } from "@/lib/persistence";
interface Props { configUrl?: string; }
function Inner({ configUrl }: Props) {
  const { nodes, edges, visibility, customer, hydrated, onNodesChange, onEdgesChange, setNodes, setEdges, setVisibility, setCustomer, loadDiagram, resetDiagram } = useDiagramState();
  const { fitView } = useReactFlow();
  const { toasts, show, dismiss } = useToast();
  useEffect(() => {
    if (!hydrated || !configUrl) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(configUrl, { signal: ctrl.signal });
        if (!res.ok) { show(`Failed to fetch config (HTTP ${res.status})`, "error"); return; }
        loadDiagram(parseImportedDiagram(await res.text()));
        setTimeout(() => fitView({ padding: 0.2 }), 100);
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
        show(`Could not load config: ${err instanceof Error ? err.message : String(err)}`, "error");
      }
    })();
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, configUrl]);
  const onAutoLayout = useCallback(() => { setNodes((n) => applyAutoLayout(n, edges)); setTimeout(() => fitView({ padding: 0.2 }), 50); }, [edges, setNodes, fitView]);
  const onExportImage = useCallback(async (format: "png" | "svg") => {
    const el = document.querySelector<HTMLElement>(".react-flow"); if (!el) return;
    const filter = (n: Element) => !n.classList?.contains("react-flow__minimap") && !n.classList?.contains("react-flow__controls");
    try {
      const stamp = new Date().toISOString().slice(0, 10);
      const url = format === "png" ? await toPng(el, { pixelRatio: 2, filter }) : await toSvg(el, { filter });
      const a = document.createElement("a"); a.href = url; a.download = `okta-topology-${stamp}.${format}`; a.click();
    } catch (err) { show(`Export failed: ${err instanceof Error ? err.message : String(err)}`, "error"); }
  }, [show]);
  const onReset = useCallback(() => { clearStoredDiagram(); resetDiagram(); setTimeout(() => fitView({ padding: 0.25 }), 50); }, [resetDiagram, fitView]);
  if (!hydrated) return <div className="grid h-screen w-screen place-items-center text-sm text-slate-500">Loading…</div>;
  return (
    <CustomerProvider value={customer}>
      <div className="flex h-screen w-screen flex-col overflow-hidden">
        <Toolbar nodes={nodes} edges={edges} visibility={visibility} customer={customer} onLoad={loadDiagram} onReset={onReset} onAutoLayout={onAutoLayout} onExportImage={onExportImage} onError={(m) => show(m, "error")} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar nodes={nodes} visibility={visibility} customer={customer} onSetVisibility={setVisibility} onSetCustomer={setCustomer} />
          <main className="relative flex-1 bg-slate-50 dark:bg-slate-900">
            <DiagramCanvas nodes={nodes} edges={edges} visibility={visibility} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} setNodes={setNodes} setEdges={setEdges} />
          </main>
        </div>
      </div>
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </CustomerProvider>
  );
}
export default function DiagramApp(props: Props) {
  return <ReactFlowProvider><Inner {...props} /></ReactFlowProvider>;
}
