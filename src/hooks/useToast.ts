"use client";
import { useCallback, useRef, useState } from "react";
export interface Toast { id: number; message: string; type: "error" | "info" | "success"; }
let seq = 0;
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
    const t = timers.current.get(id); if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);
  const show = useCallback((message: string, type: Toast["type"] = "info", ms = 5000) => {
    const id = ++seq;
    setToasts((ts) => [...ts, { id, message, type }]);
    timers.current.set(id, setTimeout(() => dismiss(id), ms));
    return id;
  }, [dismiss]);
  return { toasts, show, dismiss };
}
