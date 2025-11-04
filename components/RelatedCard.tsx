"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { type Video } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { getVideoAbsoluteUrl } from "@/lib/api";

export function RelatedCard({
  video,
  className,
}: {
  video: Video;
  className?: string;
}) {
  const router = useRouter();
  const videoUrl = getVideoAbsoluteUrl(video);
  const slug = encodeURIComponent(video.filename);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/${slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") router.push(`/${slug}`);
      }}
      className={cn("h-full cursor-pointer outline-none", className)}
    >
      <Card className="flex min-h-[200px] h-full flex-col overflow-hidden transition-all hover:-translate-y-[1px] hover:shadow-md">
        <div className="relative aspect-video w-full overflow-hidden">
          <video
            src={videoUrl}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            muted
            playsInline
            preload="metadata"
            aria-label={`${video.displayName || video.filename} thumbnail`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#023e8a]/40 via-[#03045e]/20 to-transparent" />
        </div>
        <CardContent className="p-3">
          <div className="truncate text-sm font-medium">
            {video.displayName || video.filename}
          </div>
          <div className="mt-1 truncate text-xs text-muted-foreground">
            {video.channel ?? "Unknown Channel"} • {video.sizeFormatted}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RelatedCard;
