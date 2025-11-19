"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useVideos } from "@/hooks/useVideos";
import { getVideoAbsoluteUrl, type Video } from "@/lib/api";
import RelatedCard from "@/components/RelatedCard";

export default function VideoPage() {
  // const params = useParams();
  const searchParams = useSearchParams();

  const { state, setSearch, loadMore } = useVideos({ pageSize: 24 });
  // const videoParam = decodeURIComponent(String(params?.video ?? ""));
  const id = searchParams.get("id");

  const selected: Video | undefined = React.useMemo(() => {
    return state.videos.find((v) => v.id === id) ?? state.videos[0];
  }, [id, state.videos]);

  console.log(selected);

  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    setLoaded(false);
  }, [selected?.url]);

  const onSearchChange = React.useCallback(
    (q: string) => setSearch(q),
    [setSearch]
  );

  return (
    <div className="min-h-screen">
      <main>
        {/* Error */}
        {state.error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        {/* 5-column responsive layout: player spans 3, related spans 2 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-8">
          {/* Player section */}
          <section className="md:col-span-6 flex flex-col justify-start items-start">
            <div className="rounded-lg w-full bg-card shadow-sm">
              <div className="relative overflow-hidden rounded-md">
                {selected ? (
                  <video
                    key={selected.url}
                    src={getVideoAbsoluteUrl(selected)}
                    className={`h-full w-full object-contain transition-opacity duration-500 ${
                      loaded ? "opacity-100" : "opacity-0"
                    }`}
                    controls
                    playsInline
                    onLoadedData={() => setLoaded(true)}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground">
                    No video selected
                  </div>
                )}
              </div>
              {selected && (
                <div className="flex flex-col gap-4 px-3 py-4">
                  <h1 className="mt-3 truncate text-lg font-semibold">
                    {selected.displayName ?? selected.filename}
                  </h1>
                </div>
              )}
            </div>
          </section>

          {/* Related content section */}
          <aside className="md:col-span-2">
            <div className="rounded-lg shadow-sm bg-accent-foreground/10 p-3">
              <h2 className="mb-3 text-xl font-semibold text-muted-foreground">
                Related videos
              </h2>
              <div className="grid grid-cols-1 gap-4 pr-4 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-sidebar-primary/20  scrollbar-track-transparent scrollbar-thumb-rounded-md max-h-[70vh]">
                {state.videos
                  .filter((v) => v.filename !== selected?.filename)
                  .map((v) => (
                    <RelatedCard key={v.filename} video={v} />
                  ))}
              </div>

              {/* Infinite scroll sentinel */}
              {state.hasNext && (
                <div className="mt-4 grid place-items-center">
                  <button
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    onClick={() => loadMore()}
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
