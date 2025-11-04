"use client";
import * as React from "react";
import Navbar from "@/components/Navbar";
import VideoGrid from "@/components/VideoGrid";
import { useVideos } from "@/hooks/useVideos";

export default function Home() {
  const { state, setSearch, loadMore } = useVideos({ pageSize: 24 });

  const onSearchChange = React.useCallback((q: string) => {
    setSearch(q);
  }, [setSearch]);

  return (
    <div className="min-h-screen">
      <Navbar onSearchChange={onSearchChange} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Error state */}
        {state.error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        {/* Empty state */}
        {!state.loading && !state.error && state.videos.length === 0 && (
          <div className="grid place-items-center rounded-md border border-border bg-card p-10 text-center text-muted-foreground">
            No videos found.
          </div>
        )}

        {/* Video grid */}
        <VideoGrid
          videos={state.videos}
          loading={state.loading}
          onEndReached={() => {
            if (state.hasNext) loadMore();
          }}
        />

        {/* Loading more indicator */}
        {state.loading && state.page > 1 && (
          <div className="mt-6 grid place-items-center text-sm text-muted-foreground">Loading more...</div>
        )}
      </main>
    </div>
  );
}