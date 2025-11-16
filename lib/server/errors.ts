import { HTTP_STATUS } from './constants';

export function jsonError(message: string, status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, details?: unknown) {
  return Response.json({ success: false, error: message, details }, { status });
}

export function notFound(message = 'Not found') {
  return jsonError(message, HTTP_STATUS.NOT_FOUND);
}

export function badRequest(message = 'Bad request', details?: unknown) {
  return jsonError(message, HTTP_STATUS.BAD_REQUEST, details);
}