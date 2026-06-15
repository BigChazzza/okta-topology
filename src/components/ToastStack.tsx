"use client";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import type { Toast } from "@/hooks/useToast";
const ICON = { error: <AlertCircle size={15} className="shrink-0 text-rose-500" />, info: <Info size={15} className="shrink-0 text-sky-500" />, success: <CheckCircle size={15} className="shrink-0 text-emerald-500" /> };
const BG = { error: "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/60", info: "border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/60", success: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/60" };
export function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-16 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`pointer-events-auto flex max-w-sm items-start gap-2 rounded-lg border px-3 py-2 shadow-lg text-xs ${BG[t.type]}`}>
          {ICON[t.type]}
          <span className="flex-1 text-slate-800 dark:text-slate-100">{t.message}</span>
          <button type="button" onClick={() => onDismiss(t.id)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><X size={13} /></button>
        </div>
      ))}
    </div>
  );
}
