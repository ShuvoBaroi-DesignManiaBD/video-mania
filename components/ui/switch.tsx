"use client";
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  checkedChildren?: React.ReactNode;
  uncheckedChildren?: React.ReactNode;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, checkedChildren, uncheckedChildren, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "group relative inline-flex h-5 w-13 shrink-0 cursor-pointer items-center rounded-full border-none data-[state=checked]:border-2 border-transparent ring-primary",
      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-inner",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary/50 data-[state=unchecked]:bg-gray-200",
      className
    )}
    {...props}
  >
    {/* Inline content area (checked/unchecked) */}
    <div className="pointer-events-none absolute inset-0 flex items-center px-2">
      <div
        className={cn(
          "flex items-center gap-1",
          "transition-opacity duration-200 ease-out",
          "group-data-[state=checked]:opacity-100 group-data-[state=unchecked]:opacity-100",
          "text-primary-foreground"
        )}
      >
        {checkedChildren}
      </div>
      <div
        className={cn(
          "ml-auto flex items-center gap-1",
          "transition-opacity duration-200 ease-out",
          "group-data-[state=unchecked]:opacity-100 group-data-[state=checked]:opacity-60",
          "text-foreground"
        )}
      >
        {uncheckedChildren}
      </div>
    </div>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none absolute block size-5 ml-1 data-[state=unchecked]:-ml-0.5 rounded-full bg-primary shadow-md ring-0",
        "transition-transform duration-200 ease-out",
        "data-[state=unchecked]:bg-gray-500 data-[state=checked]:translate-x-[30px] data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = "Switch";

export default Switch;
