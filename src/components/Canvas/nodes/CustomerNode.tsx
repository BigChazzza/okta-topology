"use client";
import { type NodeProps } from "@xyflow/react";
import { Building2 } from "lucide-react";
import { EditableLabel } from "../EditableLabel";
import { NodeShell } from "../NodeShell";
import { useCustomer } from "@/contexts/CustomerContext";
const W = 160, H = 104;
function initials(n?: string) {
  if (!n) return "?";
  return n.trim().split(/\s+/).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";
}
export function CustomerNode(props: NodeProps) {
  const { id, selected } = props;
  const c = useCustomer();
  const name = c.name?.trim() || "Customer";
  const logo = c.logoDataUrl ?? c.logoUrl;
  return (
    <NodeShell nodeId={id} selected={selected} ariaLabel={name} width={W} height={H}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800">
      <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
        {logo
          ? <img src={logo} alt={name} className="h-full w-full object-contain" draggable={false} />
          : c.name ? <span className="text-sm font-bold">{initials(c.name)}</span>
          : <Building2 size={22} />}
      </div>
      <EditableLabel nodeId={id} label={name}
        className="max-w-[140px] px-2 text-[11px] font-semibold leading-tight text-slate-700 dark:text-slate-100" />
    </NodeShell>
  );
}
