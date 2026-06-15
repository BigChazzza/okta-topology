"use client";
import { type NodeProps } from "@xyflow/react";
import { EditableLabel } from "../EditableLabel";
import { NodeShell } from "../NodeShell";
import { OktaIcon } from "@/components/OktaIcon";
import { getComponentDefinition } from "@/lib/componentRegistry";
import type { DiagramNodeData } from "@/lib/types";

const W = 212, H = 76;

export function OktaComponentNode(props: NodeProps) {
  const { id, data, selected } = props as NodeProps & { data: DiagramNodeData };
  const def = getComponentDefinition(data.componentId);
  const color = def?.color ?? "#007DC1";
  const label = (data.label as string | undefined) ?? def?.label ?? "";
  return (
    <NodeShell nodeId={id} selected={selected} ariaLabel={label} width={W} height={H}
      className="flex items-center gap-2 rounded-xl border-2 border-solid bg-transparent px-3 shadow-sm"
      style={{ borderColor: color }}>
      <div className="grid h-9 w-9 shrink-0 place-items-center text-slate-900 dark:text-white">
        <OktaIcon size={30} color="currentColor" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] font-semibold uppercase tracking-wide" style={{ color }}>Okta</div>
        <EditableLabel nodeId={id} label={label}
          className="text-xs font-semibold leading-tight text-slate-800 dark:text-slate-100" />
      </div>
    </NodeShell>
  );
}
