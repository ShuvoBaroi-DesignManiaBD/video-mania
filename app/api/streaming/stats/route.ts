import { HTTP_STATUS } from '@/lib/server/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // Placeholder stats; integrate real tracking if available
  return Response.json({ success: true, data: { activeStreams: 0 } }, { status: HTTP_STATUS.OK });
}