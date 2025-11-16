import { HTTP_STATUS } from '@/lib/server/constants';
import { VideoService } from '@/lib/server/videoService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = await VideoService.getVideoStats();
  if (!stats.success) {
    return Response.json({ success: false, message: stats.error || 'Failed to get metrics' }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
  return Response.json({ success: true, metrics: stats }, { status: HTTP_STATUS.OK });
}