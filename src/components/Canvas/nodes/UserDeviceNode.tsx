"use client";
import { type NodeProps } from "@xyflow/react";
import {
  Bot,
  Laptop,
  Monitor,
  ShieldCheck,
  Smartphone,
  User,
  UserCheck,
  UserX,
} from "lucide-react";
import { EditableLabel } from "../EditableLabel";
import { NodeShell } from "../NodeShell";
import { getComponentDefinition } from "@/lib/componentRegistry";
import type { DiagramNodeData } from "@/lib/types";

const W = 168, H = 88;

const ICONS: Record<string, React.ReactNode> = {
  "end-user":        <User size={20} />,
  "admin-user":      <UserCheck size={20} />,
  "guest-user":      <UserX size={20} />,
  "nhi":             <Bot size={20} />,
  "managed-device":  <ShieldCheck size={20} />,
  "unmanaged-device":<Laptop size={20} />,
  "mobile-device":   <Smartphone size={20} />,
  "desktop":         <Monitor size={20} />,
};

export function UserDeviceNode(props: NodeProps) {
  const { id, data, selected } = props as NodeProps & { data: DiagramNodeData };
  const def = getComponentDefinition(data.componentId);
  const color = def?.color ?? "#4F46E5";
  const icon = ICONS[data.componentId] ?? <User size={20} />;

  return (
    <NodeShell
      nodeId={id}
      selected={selected}
      ariaLabel={data.label}
      width={W}
      height={H}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
      style={{ borderColor: color }}
    >
      <div
        className="grid h-11 w-11 place-items-center rounded-xl text-white"
        style={{ background: color }}
      >
        {icon}
      </div>
      <EditableLabel
        nodeId={id}
        label={data.label}
        className="px-2 text-[11px] font-semibold leading-tight text-slate-700 dark:text-slate-100"
      />
    </NodeShell>
  );
}
