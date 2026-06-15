"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsClient } from "@/hooks/useIsClient";
import { Button } from "../ui/Button";
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsClient();
  const dark = mounted && resolvedTheme === "dark";
  return (
    <Button variant="ghost" onClick={() => setTheme(dark ? "light" : "dark")} aria-label="Toggle theme">
      {mounted ? (dark ? <Sun size={14} /> : <Moon size={14} />) : <span style={{ width: 14, height: 14 }} />}
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </Button>
  );
}
