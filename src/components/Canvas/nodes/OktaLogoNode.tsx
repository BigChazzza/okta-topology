"use client";
import Image from "next/image";
import { type NodeProps } from "@xyflow/react";
import { NodeShell } from "../NodeShell";
const W = 220, H = 130;
export function OktaLogoNode(props: NodeProps) {
  const { id, selected } = props;
  return (
    <NodeShell nodeId={id} selected={selected} ariaLabel="Okta" width={W} height={H}
      className="grid place-items-center rounded-2xl border-2 bg-transparent px-6 shadow-md"
      style={{ borderColor: "#007DC1" }}>
      <Image src="/okta-logo.svg" alt="Okta" width={170} height={90} priority draggable={false} className="h-auto w-full dark:invert" />
    </NodeShell>
  );
}
