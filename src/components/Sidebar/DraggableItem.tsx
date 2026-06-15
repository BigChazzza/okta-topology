"use client";
import { AppWindow, Globe, LayoutGrid } from "lucide-react";
import { OktaIcon } from "@/components/OktaIcon";
import { DRAG_MIME } from "@/lib/dragMime";
import type { ComponentDefinition } from "@/lib/types";

const RESOURCE_ICONS: Record<string, React.ReactNode> = {
  "oin-application":    <LayoutGrid size={18} />,
  "custom-application": <AppWindow size={18} />,
  "api-endpoint":       <Globe size={18} />,
  "saml-application":   <AppWindow size={18} />,
  "oidc-application":   <AppWindow size={18} />,
};

interface Props { component: ComponentDefinition; placedCount: number; }

export function DraggableItem({ component, placedCount }: Props) {
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(DRAG_MIME, component.id);
    e.dataTransfer.setData("text/plain", component.label);
    e.dataTransfer.effectAllowed = "move";
  };
  const icon = component.nodeType === "resource"
    ? (RESOURCE_ICONS[component.id] ?? <AppWindow size={18} />)
    : <OktaIcon size={22} color="#FFFFFF" />;
  return (
    <div role="button" tabIndex={0} draggable onDragStart={onDragStart}
      title={`Drag onto canvas — ${component.label}`}
      className="group flex cursor-grab items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 text-left shadow-sm transition hover:border-slate-300 hover:shadow active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-white" style={{ background: component.color }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold text-slate-700 dark:text-slate-100">{component.label}</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {placedCount > 0 ? `${placedCount} on canvas` : "Drag to canvas"}
        </div>
      </div>
    </div>
  );
}
