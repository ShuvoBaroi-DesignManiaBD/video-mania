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
  const search = searchParams.get('search') || undefined;
  const sort = (searchParams.get('sort') || 'name') as 'name'|'size'|'date';
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const contentGeneratedParam = searchParams.get('contentGenerated');
  const contentGenerated = typeof contentGeneratedParam === 'string' ? (contentGeneratedParam === 'true' ? true : contentGeneratedParam === 'false' ? false : undefined) : undefined;

  if (limit !== undefined && (Number.isNaN(limit) || limit < 1 || limit > 100)) {
    return json({ success: false, message: 'Limit must be between 1 and 100' }, HTTP_STATUS.BAD_REQUEST);
  }
  if (Number.isNaN(page) || page < 1) {
    return json({ success: false, message: 'Page must be >= 1' }, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await VideoService.getVideoList({ page, limit, sort, search, contentGenerated });
  if (!result.success) {
    return json({ success: false, message: result.error || 'Failed to retrieve video list' }, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
  return json({
    success: true,
    message: SUCCESS_MESSAGES.VIDEOS_RETRIEVED,
    data: {
      videos: result.videos,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev,
      }
    }
  });
}