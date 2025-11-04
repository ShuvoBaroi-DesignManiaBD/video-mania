"use client";
import * as React from "react";
import { VideoCard } from "@/components/VideoCard";
import { type Video } from "@/lib/api";
import { Loader2 } from "lucide-react";

export function VideoGrid({ videos, loading, onEndReached }: {
  videos: Video[];
  loading?: boolean;
  onEndReached?: () => void;
}) {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  console.log(videos);

  React.useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) onEndReached?.();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onEndReached]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 4xl:grid-cols-4">
        {videos.map((v) => (
          <VideoCard key={v.filename} video={v} />
        ))}
        <div ref={sentinelRef} />
      </div>

      {loading && (
        <div className="pointer-events-none absolute top-2 left-2 z-10">
          <div aria-live="polite" className="flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1 shadow">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">Loading results…</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoGrid;