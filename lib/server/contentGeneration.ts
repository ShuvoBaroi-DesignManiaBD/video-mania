import { ContentStore } from './contentStore';
import { VideoService } from './videoService';

export type GenerationResult = {
  success: boolean;
  filename: string;
  title?: string;
  description?: string;
  meta?: Record<string, unknown> | null;
  error?: string;
};

function keywordsFromFilename(name: string): string[] {
  return name
    .replace(/\.[^.]+$/, '')
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

export async function generateContentForVideo(filename: string): Promise<GenerationResult> {
  const info = await VideoService.getVideoInfo(filename);
  if (!info.success) {
    return { success: false, filename, error: info.error || 'Video info not found' };
  }
  const baseTitle = info.video?.title ?? info.video?.displayName ?? filename;
  const description = info.video?.description ?? `Auto-generated summary for ${baseTitle}.`;
  const meta = {
    ...(info.video?.meta ?? {}),
    keywords: keywordsFromFilename(filename),
    contentGeneratedAt: new Date().toISOString(),
  } as Record<string, unknown>;
  await ContentStore.set(filename, {
    title: baseTitle,
    description,
    meta,
    contentGenerated: true,
  });
  return { success: true, filename, title: baseTitle, description, meta };
}

export async function generateContentBulk(filenames: string[]): Promise<{ success: boolean; results: GenerationResult[] }>{
  const results: GenerationResult[] = [];
  for (const f of filenames) {
    // Generate sequentially to keep resource usage bounded
    results.push(await generateContentForVideo(f));
  }
  return { success: true, results };
}