import { HTTP_STATUS } from '@/lib/server/constants';
import { VIDEO_DIRECTORY } from '@/lib/server/config';
import { createReadStream, statSync, existsSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const base = path.join(VIDEO_DIRECTORY, 'thumbnails');
  const filePath = path.join(base, `${filename}.jpg`);
  if (!existsSync(filePath)) {
    return new Response('Thumbnail not found', { status: HTTP_STATUS.NOT_FOUND });
  }
  const stats = statSync(filePath);
  const stream = createReadStream(filePath);
  const readable = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => controller.enqueue(chunk));
      stream.on('end', () => controller.close());
      stream.on('error', (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    }
  });
  return new Response(readable, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': String(stats.size),
      'Cache-Control': 'public, max-age=86400'
    }
  });
}