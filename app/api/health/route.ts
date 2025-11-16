import { HTTP_STATUS } from '@/lib/server/constants';
import { VIDEO_DIRECTORY } from '@/lib/server/config';
import { accessSync, constants as fsConstants } from 'fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    accessSync(VIDEO_DIRECTORY, fsConstants.R_OK);
    return Response.json({ status: 'ok', videoDir: VIDEO_DIRECTORY }, { status: HTTP_STATUS.OK });
  } catch {
    return Response.json({ status: 'error', message: 'Video directory not accessible' }, { status: HTTP_STATUS.SERVICE_UNAVAILABLE });
  }
}