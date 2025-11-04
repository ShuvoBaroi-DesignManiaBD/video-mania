import * as React from "react";
import { cn } from "@/lib/utils";
import { CircleUser } from "lucide-react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
}

export function Avatar({ src, alt, className, ...props }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex overflow-hidden rounded-full", className)} {...props}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? "Avatar"} className="h-full w-full object-cover" />
      ) : (
        <CircleUser className="fill-accent stroke-primary size-8" />
      )}
    </div>
  );
}

export default Avatar;