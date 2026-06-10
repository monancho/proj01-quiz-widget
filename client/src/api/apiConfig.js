const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '';

export function getApiBaseUrl() {
  if (rawApiBaseUrl) {
    return rawApiBaseUrl.replace(/\/$/, '');
  }

  if (import.meta.env.DEV) {
    return '';
  }

  throw new Error('VITE_API_BASE_URL is required for production API requests.');
}

export function buildApiUrl(path) {
  return `${getApiBaseUrl()}${path}`;
}
