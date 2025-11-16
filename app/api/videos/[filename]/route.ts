import type { NextRequest } from 'next/server';
import { streamVideoResponse, headVideoResponse } from '@/lib/server/stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const range = req.headers.get('range') || undefined;
  return streamVideoResponse(filename, range);
}

export async function HEAD(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  return headVideoResponse(filename);
}