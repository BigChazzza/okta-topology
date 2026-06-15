"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
const DiagramApp = dynamic(() => import("@/components/DiagramApp"), { ssr: false, loading: () => <div className="grid h-screen w-screen place-items-center text-sm text-slate-500">Loading…</div> });
function PageInner() {
  const params = useSearchParams();
  return <DiagramApp configUrl={params.get("config") ?? undefined} />;
}
export default function Home() {
  return <Suspense fallback={<div className="grid h-screen w-screen place-items-center text-sm text-slate-500">Loading…</div>}><PageInner /></Suspense>;
}
