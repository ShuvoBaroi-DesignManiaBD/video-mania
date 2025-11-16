import fs from 'node:fs';
import path from 'node:path';
import { VIDEO_DIRECTORY } from './config';
import { MIME_TYPES, VIDEO_EXTENSIONS, formatFileSize } from './constants';
import { ContentStore } from './contentStore';

export type Video = {
  id: string;
  filename: string;
  displayName: string;
  size: number;
  sizeFormatted: string;
  mimeType: string;
  extension: string;
  lastModified: Date;
  url: string;
  contentGenerated?: boolean;
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;
};

function generateVideoId(filename: string, ext: string, size: number): string {
  const base = `${filename}:${ext}:${size}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16);
}

export const VideoService = {
  async getVideoList(options: {
    page?: number;
    limit?: number;
    sort?: 'name' | 'size' | 'date';
    search?: string;
    contentGenerated?: boolean;
  } = {}): Promise<
    | {
        success: true;
        videos: Video[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      }
    | { success: false; error: string }
  > {
    const {
      page = 1,
      limit = 24,
      sort = 'name',
      search,
      contentGenerated,
    } = options;

    let files: string[] = [];
    try {
      files = fs.readdirSync(VIDEO_DIRECTORY);
    } catch {
      return { success: false as const, error: 'Failed to access video directory' };
    }

    const items: Video[] = [];
    for (const filename of files) {
      const ext = path.extname(filename).toLowerCase();
      if (!VIDEO_EXTENSIONS.includes(ext)) continue;
      try {
        const stats = fs.statSync(path.join(VIDEO_DIRECTORY, filename));
        if (!stats.isFile()) continue;
        const stored = await ContentStore.get(filename);
        const v: Video = {
          id: generateVideoId(filename, ext, stats.size),
          filename,
          displayName: filename.replace(/\.[^/.]+$/, ''),
          size: stats.size,
          sizeFormatted: formatFileSize(stats.size),
          mimeType: MIME_TYPES[ext] || 'application/octet-stream',
          extension: ext,
          lastModified: stats.mtime,
          url: `/videos/${encodeURIComponent(filename)}`,
          contentGenerated: !!stored.contentGenerated,
          ...(stored.title ? { title: stored.title } : {}),
          ...(stored.description ? { description: stored.description } : {}),
          ...(stored.meta ? { meta: stored.meta } : {}),
        };
        items.push(v);
      } catch {}
    }

    let filtered = items;
    if (typeof contentGenerated === 'boolean') {
      filtered = filtered.filter((v) => !!v.contentGenerated === contentGenerated);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.displayName.toLowerCase().includes(q) ||
          (v.title ? v.title.toLowerCase().includes(q) : false)
      );
    }

    filtered.sort((a, b) => {
      switch (sort) {
        case 'size':
          return b.size - a.size;
        case 'date':
          return b.lastModified.getTime() - a.lastModified.getTime();
        default:
          return a.displayName.localeCompare(b.displayName);
      }
    });

    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const videos = filtered.slice(start, end);

    return {
      success: true as const,
      videos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };
  },

  async getVideoInfo(
    filename: string
  ): Promise<
    | { success: true; video: Video; fileInfo: { size: number; modified: Date; isFile: boolean } }
    | { success: false; error: string }
  > {
    const ext = path.extname(filename).toLowerCase();
    if (!VIDEO_EXTENSIONS.includes(ext)) {
      return { success: false as const, error: 'Unsupported file type' };
    }
    const filePath = path.join(VIDEO_DIRECTORY, filename);
    try {
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) return { success: false as const, error: 'File not found' };
      const stored = await ContentStore.get(filename);
      const video: Video = {
        id: generateVideoId(filename, ext, stats.size),
        filename,
        displayName: filename.replace(/\.[^/.]+$/, ''),
        size: stats.size,
        sizeFormatted: formatFileSize(stats.size),
        mimeType: MIME_TYPES[ext] || 'application/octet-stream',
        extension: ext,
        lastModified: stats.mtime,
        url: `/videos/${encodeURIComponent(filename)}`,
        contentGenerated: !!stored.contentGenerated,
        ...(stored.title ? { title: stored.title } : {}),
        ...(stored.description ? { description: stored.description } : {}),
        ...(stored.meta ? { meta: stored.meta } : {}),
      };
      return {
        success: true as const,
        video,
        fileInfo: { size: stats.size, modified: stats.mtime, isFile: true },
      };
    } catch {
      return { success: false as const, error: 'File not found' };
    }
  },

  async searchVideos(
    query: string,
    opts: { limit?: number } = {}
  ): Promise<
    | { success: true; query: string; results: Video[]; total: number }
    | { success: false; error: string; results: [] }
  > {
    if (!query) return { success: false as const, error: 'Invalid search query', results: [] };
    const { limit = 20 } = opts;
    const list = await this.getVideoList({ search: query, limit, sort: 'name' });
    if (!list.success) return { success: false as const, error: list.error || 'Search failed', results: [] };
    return { success: true as const, query, results: list.videos, total: list.total };
  },

  async getVideoStats() {
    let files: string[] = [];
    try {
      files = fs.readdirSync(VIDEO_DIRECTORY);
    } catch {
      return { success: false, error: 'Failed to access video directory' };
    }
    let totalSize = 0;
    let count = 0;
    const typeCount: Record<string, number> = {};
    for (const filename of files) {
      const ext = path.extname(filename).toLowerCase();
      if (!VIDEO_EXTENSIONS.includes(ext)) continue;
      try {
        const stats = fs.statSync(path.join(VIDEO_DIRECTORY, filename));
        if (!stats.isFile()) continue;
        totalSize += stats.size;
        count += 1;
        typeCount[ext] = (typeCount[ext] || 0) + 1;
      } catch {}
    }
    return {
      success: true as const,
      totalFiles: count,
      totalSize,
      totalSizeFormatted: formatFileSize(totalSize),
      typeCount,
    };
  },

  async getNewlyAdded(quantity: number | 'all' = 'all') {
    let files: string[] = [];
    try {
      files = fs.readdirSync(VIDEO_DIRECTORY);
    } catch {
      return { success: false, error: 'Failed to access video directory', videos: [], total: 0 };
    }
    const items: { filename: string; addedAt: Date }[] = [];
    for (const filename of files) {
      const ext = path.extname(filename).toLowerCase();
      if (!VIDEO_EXTENSIONS.includes(ext)) continue;
      try {
        const stats = fs.statSync(path.join(VIDEO_DIRECTORY, filename));
        if (!stats.isFile()) continue;
        items.push({ filename, addedAt: stats.birthtime || stats.mtime });
      } catch {}
    }
    items.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());

    const results: Video[] = [];
    for (const item of items) {
      const info = await this.getVideoInfo(item.filename);
      if (!info.success) continue;
      if (info.video.contentGenerated) continue;
      results.push(info.video);
    }

    const final = typeof quantity === 'number' ? results.slice(0, quantity) : results;
    return { success: true, videos: final, total: final.length };
  },
};