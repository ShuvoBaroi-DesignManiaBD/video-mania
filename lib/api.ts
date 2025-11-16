export type Video = {
  id: string;
  filename: string;
  displayName: string;
  size: number;
  sizeFormatted: string;
  mimeType: string;
  extension: string;
  lastModified: string;
  url: string; // path part like /videos/<filename>
  // Optional fields that may be added in the future
  views?: number;
  channel?: string;
};

export type VideosResponse = {
  success: boolean;
  message: string;
  data: {
    videos: Video[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// Cross-instance dedupe map keyed by query string
const inflight = new Map<string, Promise<VideosResponse>>();

function buildKey(params?: { search?: string; page?: number; limit?: number }) {
  const s = (params?.search ?? "").trim();
  const p = params?.page ?? 1;
  const l = params?.limit ?? 24;
  return `search=${s}|page=${p}|limit=${l}`;
}

export async function fetchVideos(params?: {
  search?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<VideosResponse> {
  const key = buildKey(params);

  // If an identical request is already in flight, reuse it without binding to individual AbortSignals
  const existing = inflight.get(key);
  if (existing) {
    return existing;
  }

  const url = new URL("/api/videos", BASE_URL);
  if (params?.search !== undefined) url.searchParams.set("search", params.search.trim());
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const promise = (async () => {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // Do not attach signal to shared request; prevents one consumer from aborting it for others
      // signal: params?.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch videos: ${res.status} ${res.statusText}`);
    }
    return res.json();
  })();

  inflight.set(key, promise);
  try {
    const result = await promise;
    return result;
  } finally {
    inflight.delete(key);
  }
}

export function getVideoAbsoluteUrl(video: Video): string {
  const base = BASE_URL.replace(/\/$/, "");
  const path = video.url.startsWith("/") ? video.url : `/${video.url}`;
  return `${base}${path}`;
}