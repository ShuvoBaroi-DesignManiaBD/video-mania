import { VideoService } from '@/lib/server/videoService';
import { HTTP_STATUS } from '@/lib/server/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const res = await VideoService.getNewlyAdded();
  if (!res.success) {
    return Response.json({ success: false, message: res.error || 'Failed to fetch newly added' }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
  return Response.json({ success: true, data: res.videos }, { status: HTTP_STATUS.OK });
}