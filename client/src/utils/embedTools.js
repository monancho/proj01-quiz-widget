import { embedThemeOptions } from '../constants/adminOptions.js';

export const embedIframeHeight = 620;

export function normalizeEmbedThemeMode(themeMode = 'system') {
  return embedThemeOptions.some((option) => option.value === themeMode) ? themeMode : 'system';
}

export function buildEmbedUrl(postSlug, themeMode = 'system', origin = getDefaultOrigin()) {
  const theme = normalizeEmbedThemeMode(themeMode);
  return `${origin}/embed/${encodeURIComponent(postSlug)}?theme=${theme}`;
}

export function buildIframeCode(postSlug, themeMode = 'system', origin = getDefaultOrigin()) {
  return `<iframe src="${buildEmbedUrl(postSlug, themeMode, origin)}" width="100%" height="${embedIframeHeight}" loading="lazy" allowtransparency="true" style="border:0;max-width:100%;background:transparent;"></iframe>`;
}

function getDefaultOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return '';
}
