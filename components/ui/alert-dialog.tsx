"use client";
import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export function AlertDialogPortal({ children }: { children: React.ReactNode }) {
  return <AlertDialogPrimitive.Portal>{children}</AlertDialogPrimitive.Portal>;
}

export function AlertDialogOverlay({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
}

export function AlertDialogContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-popover p-6 shadow-lg focus:outline-none",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

export function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-2", className)} {...props} />;
}
export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}
export const AlertDialogTitle = (
  props: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
) => <AlertDialogPrimitive.Title {...props} className={cn("text-lg font-semibold", props.className)} />;
export const AlertDialogDescription = (
  props: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
) => <AlertDialogPrimitive.Description {...props} className={cn("text-sm text-muted-foreground", props.className)} />;

export const AlertDialogAction = (
  props: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
) => (
  <AlertDialogPrimitive.Action
    {...props}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      props.className
    )}
  />
);

export const AlertDialogCancel = (
  props: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
) => (
  <AlertDialogPrimitive.Cancel
    {...props}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      props.className
    )}
  />
);
