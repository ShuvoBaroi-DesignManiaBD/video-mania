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

export async function fetchVideos(params?: {
  search?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<VideosResponse> {
  const url = new URL("/videos", BASE_URL);
  if (params?.search !== undefined) url.searchParams.set("search", params.search.trim());
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal: params?.signal,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch videos: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function getVideoAbsoluteUrl(video: Video): string {
  const base = BASE_URL.replace(/\/$/, "");
  const path = video.url.startsWith("/") ? video.url : `/${video.url}`;
  return `${base}${path}`;
}