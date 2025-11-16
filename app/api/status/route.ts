import { HTTP_STATUS } from '@/lib/server/constants';
import { VIDEO_DIRECTORY } from '@/lib/server/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    status: 'ok',
    env: {
      videoDirectory: VIDEO_DIRECTORY,
      nodeVersion: process.version
    }
  }, { status: HTTP_STATUS.OK });
}