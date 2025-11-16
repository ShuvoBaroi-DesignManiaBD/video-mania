import { HTTP_STATUS } from '@/lib/server/constants';
import { VIDEO_DIRECTORY } from '@/lib/server/config';
import { existsSync } from 'fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const ready = existsSync(VIDEO_DIRECTORY);
  return Response.json({ ready }, { status: ready ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE });
}