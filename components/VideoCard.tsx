import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Video } from "@/lib/api";
import { getVideoAbsoluteUrl } from "@/lib/api";
import Link from "next/link";

export function VideoCard({
  video,
  className,
}: {
  video: Video;
  className?: string;
}) {
  const videoUrl = getVideoAbsoluteUrl(video);
  const uploadedDate = React.useMemo(() => {
    const d = new Date(video.lastModified);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  }, [video.lastModified]);

  const data = { id: video?.id ?? "" };

  return (
    <Link
      href={{pathname:`/video/${video.displayName.toLocaleLowerCase().replace(/\s+/g, "-")}`, query: data}}
      rel="noopener noreferrer"
      className="block group"
    >
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 rounded-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
          className
        )}
      >
        {/* Enhanced glassmorphism container */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-slate-100/30 dark:from-slate-700/30 dark:via-transparent dark:to-slate-900/20 rounded-2xl" />
        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
          {/* Thumbnail using the video element */}
          {/* Using preload=metadata to avoid heavy network usage; playsInline & muted allow hover preview if desired */}
          <video
            src={videoUrl}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            muted
            playsInline
            preload="metadata"
            aria-label={`${video.displayName || video.filename} thumbnail`}
          />
          {/* Enhanced gradient overlay with glassmorphism effect */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent opacity-90 group-hover:opacity-70 transition-all duration-500" />
          
          {/* Enhanced play icon with glow effect */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
              <svg className="w-8 h-8 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Top badge with category icon */}
          <div className="absolute top-4 left-4">
            <div className="rounded-full bg-gradient-to-br from-primary to-purple-500 p-2 shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Duration/Size badge */}
          <div className="absolute top-4 right-4">
            <div className="rounded-full bg-black/40 backdrop-blur-sm px-3 py-1 text-xs text-white font-medium border border-white/20">
              {video.sizeFormatted}
            </div>
          </div>
        </div>
        <CardContent className="relative p-6 space-y-3">
          {/* Enhanced title with better typography */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 tracking-tight">
              {video.displayName || video.filename}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                {video.channel ?? "Unknown Channel"}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{uploadedDate || "Unknown Date"}</span>
            </div>
          </div>

          {/* Enhanced metadata with modern styling */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>1.2k</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>42</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {video.sizeFormatted}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default VideoCard;
