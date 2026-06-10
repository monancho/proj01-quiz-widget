function parseAllowedOrigins(value) {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function createCorsMiddleware(allowedOriginsValue) {
  const allowedOrigins = parseAllowedOrigins(allowedOriginsValue);

  return function corsMiddleware(req, res, next) {
    const requestOrigin = req.headers.origin;

    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
      res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    next();
  };
}

