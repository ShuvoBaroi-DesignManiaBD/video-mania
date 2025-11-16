"use client";

import { type Video } from "@/lib/api";
import VideoCard from "@/components/VideoCard";

interface VideoGridProps {
  videos: Video[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.filename} video={video} />
      ))}
    </div>
  );
}