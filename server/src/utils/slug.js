const POST_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizePostSlug(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().toLowerCase();
}

export function isValidPostSlug(value) {
  return POST_SLUG_PATTERN.test(value);
}

export function validatePostSlug(value) {
  const postSlug = normalizePostSlug(value);

  if (!postSlug) {
    return {
      ok: false,
      postSlug,
      message: 'postSlug is required'
    };
  }

  if (!isValidPostSlug(postSlug)) {
    return {
      ok: false,
      postSlug,
      message: 'postSlug must contain lowercase letters, numbers, and single hyphens only'
    };
  }

  return {
    ok: true,
    postSlug
  };
}

