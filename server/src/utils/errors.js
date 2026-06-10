export class AppError extends Error {
  constructor(statusCode, code, message, details = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(code, message, details) {
  return new AppError(400, code, message, details);
}

export function unauthorized(code, message, details) {
  return new AppError(401, code, message, details);
}

export function notFound(code, message, details) {
  return new AppError(404, code, message, details);
}

export function conflict(code, message, details) {
  return new AppError(409, code, message, details);
}

export function unprocessableEntity(code, message, details) {
  return new AppError(422, code, message, details);
}

export function tooManyRequests(code, message, details) {
  return new AppError(429, code, message, details);
}

export function badGateway(code, message, details) {
  return new AppError(502, code, message, details);
}

export function serviceUnavailable(code, message, details) {
  return new AppError(503, code, message, details);
}

export function gatewayTimeout(code, message, details) {
  return new AppError(504, code, message, details);
}

