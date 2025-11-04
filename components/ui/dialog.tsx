"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className={cn("relative z-10 w-full max-w-3xl rounded-lg border border-border bg-popover shadow-lg")}>{children}</div>
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-border p-4 font-semibold">{children}</div>;
}
export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}
export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-border p-4 flex justify-end gap-2">{children}</div>;
}