"use client";
import { ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { DraggableItem } from "./DraggableItem";
import type { CategoryMeta } from "@/lib/categories";
import type { ComponentDefinition } from "@/lib/types";
interface Props { meta: CategoryMeta; components: ComponentDefinition[]; visible: boolean; onToggleVisible: () => void; placedCounts: Record<string, number>; }
export function CategorySection({ meta, components, visible, onToggleVisible, placedCounts }: Props) {
  const [open, setOpen] = useState(true);
  const VI = visible ? Eye : EyeOff;
  const CI = open ? ChevronDown : ChevronRight;
  const total = components.reduce((s, c) => s + (placedCounts[c.id] ?? 0), 0);
  return (
    <section className="border-b border-slate-200 dark:border-slate-700">
      <header className="flex items-center gap-1 px-3 py-2">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
          className="flex flex-1 items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
          <CI size={14} />
          <span style={{ color: meta.color }}>{meta.label}</span>
          <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium normal-case text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {total}/{components.length}
          </span>
        </button>
        <button type="button" onClick={onToggleVisible} aria-label={visible ? `Hide ${meta.label}` : `Show ${meta.label}`}
          className={`grid h-7 w-7 place-items-center rounded-md transition ${visible ? "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"}`}>
          <VI size={14} />
        </button>
      </header>
      {open && (
        <div className="space-y-1.5 px-3 pb-3">
          <p className="px-1 text-[10px] text-slate-400 dark:text-slate-500">{meta.description}</p>
          {components.map((c) => <DraggableItem key={c.id} component={c} placedCount={placedCounts[c.id] ?? 0} />)}
        </div>
      )}
    </section>
  );
}
