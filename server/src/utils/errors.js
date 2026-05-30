export class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function badRequest(code, message) {
  return new AppError(400, code, message);
}

export function unauthorized(code, message) {
  return new AppError(401, code, message);
}

export function notFound(code, message) {
  return new AppError(404, code, message);
}

export function conflict(code, message) {
  return new AppError(409, code, message);
}

export function serviceUnavailable(code, message) {
  return new AppError(503, code, message);
}

