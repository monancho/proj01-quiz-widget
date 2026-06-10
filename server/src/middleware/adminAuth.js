import { createHash, timingSafeEqual } from 'node:crypto';
import { serviceUnavailable, unauthorized } from '../utils/errors.js';

function hashToken(value) {
  return createHash('sha256').update(value).digest();
}

function tokensMatch(providedToken, expectedToken) {
  return timingSafeEqual(hashToken(providedToken), hashToken(expectedToken));
}

function extractToken(req) {
  const authorization = req.headers.authorization || '';
  const bearerPrefix = 'Bearer ';

  if (authorization.startsWith(bearerPrefix)) {
    return authorization.slice(bearerPrefix.length).trim();
  }

  if (typeof req.headers['x-admin-token'] === 'string') {
    return req.headers['x-admin-token'].trim();
  }

  return '';
}

export function createAdminAuthMiddleware(env) {
  const expectedToken = env.adminApiToken;
  const isProduction = env.nodeEnv === 'production';

  return function adminAuthMiddleware(req, _res, next) {
    if (!expectedToken) {
      if (isProduction) {
        next(serviceUnavailable(
          'ADMIN_AUTH_NOT_CONFIGURED',
          'Admin API authentication is not configured'
        ));
        return;
      }

      next();
      return;
    }

    const providedToken = extractToken(req);

    if (!providedToken || !tokensMatch(providedToken, expectedToken)) {
      next(unauthorized('ADMIN_AUTH_REQUIRED', 'Admin API token is required'));
      return;
    }

    next();
  };
}
