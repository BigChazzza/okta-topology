"use client";
import { type NodeProps } from "@xyflow/react";
import { AppWindow, Globe, LayoutGrid } from "lucide-react";
import { EditableLabel } from "../EditableLabel";
import { NodeShell } from "../NodeShell";
import { getComponentDefinition } from "@/lib/componentRegistry";
import type { DiagramNodeData } from "@/lib/types";

const W = 168, H = 88;

const ICON_MAP: Record<string, React.ReactNode> = {
  "oin-application":    <LayoutGrid size={20} />,
  "custom-application": <AppWindow size={20} />,
  "api-endpoint":       <Globe size={20} />,
  "saml-application":   <AppWindow size={20} />,
  "oidc-application":   <AppWindow size={20} />,
};

export function ResourceNode(props: NodeProps) {
  const { id, data, selected } = props as NodeProps & { data: DiagramNodeData };
  const def = getComponentDefinition(data.componentId);
  const color = def?.color ?? "#059669";
  const icon = ICON_MAP[data.componentId] ?? <AppWindow size={20} />;

  return (
    <NodeShell nodeId={id} selected={selected} ariaLabel={data.label} width={W} height={H}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
      style={{ borderColor: color }}>
      <div className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: color }}>
        {icon}
      </div>
      <EditableLabel nodeId={id} label={data.label}
        className="px-2 text-[11px] font-semibold leading-tight text-slate-700 dark:text-slate-100" />
    </NodeShell>
  );
}
