const ADMIN_TOKEN_STORAGE_KEY = 'proj01.quizWidget.adminToken';

export function getAdminToken() {
  return window.sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
}

export function setAdminToken(token) {
  window.sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function clearAdminToken() {
  window.sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}
