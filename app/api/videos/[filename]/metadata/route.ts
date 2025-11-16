import type { NextRequest } from 'next/server';
import { VideoService } from '@/lib/server/videoService';
import { HTTP_STATUS } from '@/lib/server/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const info = await VideoService.getVideoInfo(filename);
  if (!info.success) {
    return Response.json({ success: false, message: info.error || 'Not found' }, { status: HTTP_STATUS.NOT_FOUND });
  }
  return Response.json({ success: true, data: info.video?.meta ?? null }, { status: HTTP_STATUS.OK });
}