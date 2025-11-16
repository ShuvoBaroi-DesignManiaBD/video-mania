import { VideoService } from '@/lib/server/videoService';
import { HTTP_STATUS } from '@/lib/server/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await VideoService.getVideoStats();
  if (!result.success) {
    return Response.json({ success: false, message: result.error || 'Failed to get stats' }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
  return Response.json(result, { status: HTTP_STATUS.OK });
}