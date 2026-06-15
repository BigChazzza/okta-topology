"use client";
import { useMemo } from "react";
import type { Node } from "@xyflow/react";
import { CategorySection } from "./CategorySection";
import { CustomerSection } from "./CustomerSection";
import { getSidebarComponents } from "@/lib/componentRegistry";
import { SIDEBAR_CATEGORIES } from "@/lib/categories";
import type { CategoryKey, CustomerConfig, DiagramNodeData, VisibilityMap } from "@/lib/types";
interface Props {
  nodes: Node<DiagramNodeData>[]; visibility: VisibilityMap; customer: CustomerConfig;
  onSetVisibility: (v: VisibilityMap) => void; onSetCustomer: (c: CustomerConfig) => void;
}
export function Sidebar({ nodes, visibility, customer, onSetVisibility, onSetCustomer }: Props) {
  const components = getSidebarComponents();
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    nodes.forEach((n) => { const id = (n.data as DiagramNodeData).componentId; m[id] = (m[id] ?? 0) + 1; });
    return m;
  }, [nodes]);
  const toggle = (key: CategoryKey) => onSetVisibility({ ...visibility, [key]: !visibility[key] });
  return (
    <aside aria-label="Component palette" className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Okta Components</h2>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Drag onto the canvas to build your topology.</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <CustomerSection customer={customer} onChange={onSetCustomer} visible={visibility.customer} onToggleVisible={() => toggle("customer")} placedCount={counts["customer"] ?? 0} />
        {SIDEBAR_CATEGORIES.map((meta) => (
          <CategorySection key={meta.key} meta={meta}
            components={components.filter((c) => c.category === meta.key).sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }))}
            visible={visibility[meta.key]} onToggleVisible={() => toggle(meta.key)} placedCounts={counts} />
        ))}
      </div>
      <footer className="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
        <div className="text-[10px] text-slate-400 dark:text-slate-500">Tip: double-click a node or arrow to rename it.</div>
        <a href="/api/schema" target="_blank" rel="noopener noreferrer"
          className="mt-1 inline-block text-[10px] text-sky-500 underline-offset-2 hover:underline dark:text-sky-400">
          View JSON schema →
        </a>
      </footer>
    </aside>
  );
}
