import type { NextRequest } from 'next/server';
import { VideoService } from '@/lib/server/videoService';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '@/lib/server/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
};

function json(data: ApiResponse, status = HTTP_STATUS.OK) {
  return Response.json(data, { status });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
  const result = await VideoService.searchVideos(query, { limit });
  if (!result.success) {
    return json({ success: false, message: result.error || 'Search failed' }, HTTP_STATUS.BAD_REQUEST);
  }
  return json({
    success: true,
    message: SUCCESS_MESSAGES.SEARCH_COMPLETED,
    data: {
      videos: result.results,
      searchCriteria: { query },
      totalResults: result.total
    }
  });
}