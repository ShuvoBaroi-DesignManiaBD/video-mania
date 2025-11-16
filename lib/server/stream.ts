import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { VIDEO_DIRECTORY } from './config';
import { MIME_TYPES, HTTP_STATUS } from './constants';

function buildHeaders(init: Record<string, string>) {
  const headers = new Headers();
  for (const [k, v] of Object.entries(init)) headers.set(k, v);
  return headers;
}

// Convert Node.js Readable stream into a Web Streams API ReadableStream
// and align its type with the DOM ReadableStream expected by Response.
function toWebReadable(stream: fs.ReadStream): ReadableStream<Uint8Array> {
  return Readable.toWeb(stream) as unknown as ReadableStream<Uint8Array>;
}

export async function streamVideoResponse(filename: string, rangeHeader?: string): Promise<Response> {
  if (!filename) return new Response('Filename required', { status: HTTP_STATUS.BAD_REQUEST });
  const filePath = path.join(VIDEO_DIRECTORY, filename);
  let stats: fs.Stats;
  try {
    stats = fs.statSync(filePath);
  } catch {
    return new Response('Not found', { status: HTTP_STATUS.NOT_FOUND });
  }
  const fileSize = stats.size;
  const ext = path.extname(filename).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  if (rangeHeader) {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start >= fileSize || end >= fileSize || start > end) {
      return new Response(null, {
        status: HTTP_STATUS.RANGE_NOT_SATISFIABLE,
        headers: buildHeaders({ 'Content-Range': `bytes */${fileSize}` }),
      });
    }

    const chunkSize = end - start + 1;
    const nodeStream = fs.createReadStream(filePath, { start, end });
    const webStream = toWebReadable(nodeStream);

    return new Response(webStream, {
      status: HTTP_STATUS.PARTIAL_CONTENT,
      headers: buildHeaders({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600',
        'Connection': 'keep-alive',
      }),
    });
  }

  const nodeStream = fs.createReadStream(filePath);
  const webStream = toWebReadable(nodeStream);
  return new Response(webStream, {
    status: HTTP_STATUS.OK,
    headers: buildHeaders({
      'Content-Length': String(fileSize),
      'Content-Type': mimeType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
      'Connection': 'keep-alive',
    }),
  });
}

export async function headVideoResponse(filename: string): Promise<Response> {
  const filePath = path.join(VIDEO_DIRECTORY, filename);
  try {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    return new Response(null, {
      status: HTTP_STATUS.OK,
      headers: buildHeaders({
        'Content-Length': String(stats.size),
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Last-Modified': stats.mtime.toUTCString(),
      }),
    });
  } catch {
    return new Response(null, { status: HTTP_STATUS.NOT_FOUND });
  }
}