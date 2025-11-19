"use client";
import * as React from "react";
import { Frown, SearchX } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useVideos } from "@/hooks/useVideos";
import VideoGrid from "@/components/VideoGrid";
import VideoGridSkeleton from "@/components/VideoGridSkeleton";
import Message from "@/components/Message";

export default function MyVideos() {
  const { state, setSearch, loadMore } = useVideos({ pageSize: 24 });

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
    <div className="space-y-8">
      {/* Welcome section with modern styling */}

      {/* Video content section */}
      <div className="">
        {renderContent()}
      </div>

      {/* Load more section */}
      {state.hasNext && (
        <div className="flex justify-center">
          <button
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300"
            onClick={() => loadMore()}
            disabled={state.loading}
          >
            {state.loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3" />
                Loading...
              </>
            ) : (
              <>
                <span>Load More Videos</span>
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
