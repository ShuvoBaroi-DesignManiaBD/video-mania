"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchVideos, type Video } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(false);
  const prevSearchRef = useRef(initialSearch.trim());
  // Track in-flight identical request to avoid duplicates under Strict Mode
  const inFlightKeyRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);

  // Debounce search to avoid rapid calls while typing
  const debouncedSearch = useDebounce(search, 300);

  const reset = useCallback(() => {
    // Soft reset: keep current videos to avoid layout shifts
    setPage(1);
    setHasNext(false);
    setError(null);
  }, []);

  const load = useCallback(
    async (opts?: { reset?: boolean }) => {
      const key = `${search}|${page}|${pageSize}`;
      // If an identical request is already in-flight, skip starting a new one
      if (isLoadingRef.current && inFlightKeyRef.current === key) {
        return;
      }

      let aborted = false;
      try {
        inFlightKeyRef.current = key;
        isLoadingRef.current = true;

        if (opts?.reset) reset();
        setLoading(true);
        setError(null);
        // Cancel any in-flight request before starting a different one
        if (inFlightKeyRef.current !== key && abortRef.current) {
          abortRef.current.abort();
        }
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
      } catch (e) {
        const err = e as { name?: string; message?: string };
        if (err?.name === "AbortError") {
          aborted = true;
          return;
        }
        setError(err?.message ?? "Something went wrong fetching videos");
      } finally {
        isLoadingRef.current = false;
        inFlightKeyRef.current = null;
        if (!aborted) setLoading(false);
      }
    },
    [page, pageSize, search, reset]
  );

  // Ensure we abort any in-flight request on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    // Initial load only once per mount
    load({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload when debounced search changes: only for 3+ chars, or when
  // clearing a previously non-empty search. Skip first run to prevent
  // duplicate calls on mount (initial load handles it).
  useEffect(() => {
    const q = debouncedSearch.trim();
    const prev = prevSearchRef.current;

    if (!mountedRef.current) {
      mountedRef.current = true;
      // Record the initial search value to compare later
      prevSearchRef.current = q;
      return;
    }

    const enoughChars = q.length >= 3;
    const becameCleared = prev.length >= 3 && q.length === 0;

    if (enoughChars || becameCleared) {
      load({ reset: true });
    }

    prevSearchRef.current = q;
  }, [debouncedSearch, load]);

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
