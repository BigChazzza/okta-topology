"use client";
import { forwardRef, type ButtonHTMLAttributes } from "react";
type V = "default" | "primary" | "ghost" | "danger";
const S: Record<V, string> = {
  default: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700",
  primary: "bg-[#007DC1] text-white border border-[#007DC1] hover:bg-[#006baa]",
  ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700",
  danger: "bg-rose-600 text-white border border-rose-600 hover:bg-rose-700",
};
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: V }>(
  function Button({ className = "", variant = "default", ...rest }, ref) {
    return <button ref={ref} type="button" className={`inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50 ${S[variant]} ${className}`} {...rest} />;
  }
);
