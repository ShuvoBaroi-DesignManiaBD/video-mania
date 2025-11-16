"use client";
import * as React from "react";
import { Frown, SearchX } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useVideos } from "@/hooks/useVideos";
import VideoGrid from "@/components/VideoGrid";
import VideoGridSkeleton from "@/components/VideoGridSkeleton";
import Message from "@/components/Message";

export default function Home() {
  const { state, setSearch, loadMore } = useVideos({ pageSize: 24 });

  const onSearchChange = React.useCallback(
    (q: string) => setSearch(q),
    [setSearch]
  );

  const renderContent = () => {
    if (state.loading) {
      return <VideoGridSkeleton count={12} />;
    }

    if (state.error) {
      return (
        <Message
          Icon={Frown}
          title="Something went wrong"
          description={state.error}
        />
      );
    }

    if (state.videos.length === 0) {
      return (
        <Message
          Icon={SearchX}
          title="No videos found"
          description="Try adjusting your search or filter to find what you're looking for."
        />
      );
    }

    return <VideoGrid videos={state.videos} />;
  };

  return (
    <div className="min-h-screen">
      <Navbar onSearchChange={onSearchChange} />

      <main className="mx-auto max-w-7xl px-4 py-10">
        {renderContent()}
        {/* {state.error && (
          <Message
            Icon={Frown}
            title="Something went wrong"
            description={state.error}
          />
        )}
        {!state.loading &&
          state.error === null &&
          state.videos.length === 0 && (
            <Message
              Icon={SearchX}
              title="No videos found"
              description="Try adjusting your search or filter to find what you're looking for."
            />
          )}
          {!state.loading && state.error === null && state.videos.length > 0 && <VideoGrid videos={state.videos} />} */}
        {/* Infinite scroll sentinel */}
        {state.hasNext && (
          <div className="mt-4 grid place-items-center">
            <button
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              onClick={() => loadMore()}
              disabled={state.loading}
            >
              {state.loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
