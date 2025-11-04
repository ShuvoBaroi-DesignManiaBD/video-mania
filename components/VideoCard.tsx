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
      href={{pathname:`${video.displayName.toLocaleLowerCase().replace(/\s+/g, "-")}`, query: data}}
      rel="noopener noreferrer"
      className="block"
    >
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:shadow-md hover:-translate-y-[1px]",
          className
        )}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          {/* Thumbnail using the video element */}
          {/* Using preload=metadata to avoid heavy network usage; playsInline & muted allow hover preview if desired */}
          <video
            src={videoUrl}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            muted
            playsInline
            preload="metadata"
            aria-label={`${video.displayName || video.filename} thumbnail`}
          />
          {/* Gradient overlay for better contrast, blended with theme blues */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#023e8a]/20 via-[#03045e]/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
          {/* Play icon */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <CardContent className="p-3">
          <div className="line-clamp-2 font-medium truncate">
            {video.displayName || video.filename}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {video.channel ?? "Unknown Channel"} • {video.sizeFormatted} •{" "}
            {uploadedDate || "Unknown Date"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default VideoCard;
