"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchVideos, type Video } from "@/lib/api";

type UseVideosOptions = {
  initialSearch?: string;
  pageSize?: number;
};

export function useVideos({
  initialSearch = "",
  pageSize = 24,
}: UseVideosOptions = {}) {
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState<Video[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    // Soft reset: keep current videos to avoid layout shifts
    setPage(1);
    setHasNext(false);
    setError(null);
  }, []);

  const load = useCallback(
    async (opts?: { reset?: boolean }) => {
      try {
        if (opts?.reset) reset();
        setLoading(true);
        setError(null);
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        const res = await fetchVideos({
          search,
          page,
          limit: pageSize,
          signal: abortRef.current.signal,
        });
        const newVideos = res.data.videos;
        setVideos((prev) =>
          page === 1 || opts?.reset ? newVideos : [...prev, ...newVideos]
        );
        setHasNext(res.data.pagination.hasNext);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e?.message ?? "Something went wrong fetching videos");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search, reset]
  );

  useEffect(() => {
    // Initial load without wiping grid after
    load({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload when search changes with 3+ chars, or when cleared
  useEffect(() => {
    const shouldSearch =
      search.trim().length >= 3 || search.trim().length === 0;
    if (shouldSearch) {
      // Keep grid stable while fetching; soft reset keeps items until new ones arrive
      load({ reset: true });
    }
  }, [search, load]);

  const loadMore = useCallback(() => {
    if (loading || !hasNext) return;
    setPage((p) => p + 1);
  }, [hasNext, loading]);

  useEffect(() => {
    if (page > 1) {
      load();
    }
  }, [page, load]);

  const state = useMemo(
    () => ({ videos, loading, error, page, hasNext }),
    [videos, loading, error, page, hasNext]
  );

  return {
    state,
    search,
    setSearch,
    load,
    loadMore,
    reset,
  } as const;
}
