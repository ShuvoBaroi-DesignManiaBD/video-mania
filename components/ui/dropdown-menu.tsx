"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function DropdownMenu({ trigger, children, className }: { trigger: React.ReactNode; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block text-left", className)}>
      <button type="button" onClick={() => setOpen(o => !o)} className="inline-flex items-center gap-2">
        {trigger}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md border border-input bg-popover p-1 shadow focus:outline-none">
          <div className="grid gap-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onSelect }: { children: React.ReactNode; onSelect?: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-start rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </button>
  );
}