import type { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/lib/server/constants';
import { generateContentForVideo, generateContentBulk } from '@/lib/server/contentGeneration';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { filename, filenames, legacy } = body as { filename?: string; filenames?: string[]; legacy?: boolean };

    if (legacy && filename && !filenames) {
      const result = await generateContentForVideo(filename);
      return Response.json({ success: result.success, data: result, error: result.error }, { status: result.success ? HTTP_STATUS.OK : HTTP_STATUS.BAD_REQUEST });
    }

    if (Array.isArray(filenames) && filenames.length > 0) {
      const res = await generateContentBulk(filenames);
      return Response.json({ success: true, data: res.results }, { status: HTTP_STATUS.OK });
    }

    if (typeof filename === 'string' && filename.length > 0) {
      const result = await generateContentForVideo(filename);
      return Response.json({ success: result.success, data: result, error: result.error }, { status: result.success ? HTTP_STATUS.OK : HTTP_STATUS.BAD_REQUEST });
    }

    return Response.json({ success: false, error: 'Invalid request body' }, { status: HTTP_STATUS.BAD_REQUEST });
  } catch (err) {
    const error = err as { message?: string };
    return Response.json({ success: false, error: error?.message || 'Unexpected server error' }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}