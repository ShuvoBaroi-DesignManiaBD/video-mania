import { HTTP_STATUS } from '@/lib/server/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ live: true }, { status: HTTP_STATUS.OK });
}