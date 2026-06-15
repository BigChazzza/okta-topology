"use client";
import { Building2, Eye, EyeOff, ImageUp, Trash2 } from "lucide-react";
import { useRef } from "react";
import { DRAG_MIME } from "@/lib/dragMime";
import type { CustomerConfig } from "@/lib/types";
const MAX = 1_500_000;
function initials(n?: string) { if (!n) return "?"; return n.trim().split(/\s+/).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?"; }
interface Props { customer: CustomerConfig; onChange: (n: CustomerConfig) => void; visible: boolean; onToggleVisible: () => void; placedCount: number; }
export function CustomerSection({ customer, onChange, visible, onToggleVisible, placedCount }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const VI = visible ? Eye : EyeOff;
  const hasName = !!customer.name?.trim();
  const logo = customer.logoDataUrl ?? customer.logoUrl;
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = ""; if (!f) return;
    if (!f.type.startsWith("image/")) { window.alert("Please choose an image file."); return; }
    if (f.size > MAX) { window.alert(`Image too large (max ${(MAX / 1e6).toFixed(1)} MB).`); return; }
    const url = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = () => rej(r.error); r.readAsDataURL(f); });
    onChange({ ...customer, logoDataUrl: url });
  };
  return (
    <section className="border-b border-slate-200 dark:border-slate-700">
      <header className="flex items-center gap-1 px-3 py-2">
        <span className="flex flex-1 items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Customer
          <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium normal-case text-slate-600 dark:bg-slate-700 dark:text-slate-200">{placedCount}</span>
        </span>
        <button type="button" onClick={onToggleVisible} aria-label={visible ? "Hide" : "Show"}
          className={`grid h-7 w-7 place-items-center rounded-md transition ${visible ? "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"}`}>
          <VI size={14} />
        </button>
      </header>
      <div className="space-y-2 px-3 pb-3">
        <label className="block">
          <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Customer name</span>
          <input type="text" value={customer.name ?? ""} onChange={(e) => onChange({ ...customer, name: e.target.value })} placeholder="Acme Inc."
            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
        </label>
        <div>
          <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Company logo</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
              <ImageUp size={13} />{customer.logoDataUrl ? "Replace" : "Upload"}
            </button>
            {customer.logoDataUrl && (
              <button type="button" onClick={() => onChange({ ...customer, logoDataUrl: undefined })}
                className="grid h-8 w-8 place-items-center rounded-md border border-slate-300 bg-white text-slate-500 hover:text-rose-600 dark:border-slate-600 dark:bg-slate-800">
                <Trash2 size={13} />
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>
        <div role="button" tabIndex={0}
          draggable={hasName}
          onDragStart={(e) => { if (!hasName) { e.preventDefault(); return; } e.dataTransfer.setData(DRAG_MIME, "customer"); e.dataTransfer.setData("text/plain", customer.name ?? "Customer"); e.dataTransfer.effectAllowed = "move"; }}
          className={`mt-1 flex items-center gap-3 rounded-lg border p-2 text-left shadow-sm transition ${hasName ? "cursor-grab border-slate-200 bg-white hover:border-slate-300 hover:shadow active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800" : "cursor-not-allowed border-dashed border-slate-200 bg-slate-50 opacity-70 dark:border-slate-700 dark:bg-slate-800/50"}`}>
          <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            {logo ? <img src={logo} alt="" className="h-full w-full object-contain" draggable={false} /> : customer.name ? <span className="text-xs font-bold">{initials(customer.name)}</span> : <Building2 size={18} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-slate-700 dark:text-slate-100">{customer.name?.trim() || "(unnamed)"}</div>
            <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">{hasName ? (placedCount > 0 ? `${placedCount} on canvas` : "Drag to canvas") : "Add a name to enable"}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
