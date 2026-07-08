import axios from 'axios';

// In development VITE_API_BASE_URL is empty — Vite's dev-proxy handles /api/*.
// In production set VITE_API_BASE_URL to your domain (e.g. https://api.3dees.com).
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '') + '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ── Token refresh state ────────────────────────────────────────────────────
let isRefreshing = false;
let refreshSubscribers = [];

function notifySubscribers(newToken, error) {
  refreshSubscribers.forEach((cb) => cb(newToken, error));
  refreshSubscribers = [];
}

// ── Request interceptor — inject Bearer token ──────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('3dees_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — handle errors and silent token refresh ──────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const body = error.response?.data;
    const status = error.response?.status;

    // Silently refresh the access token on TokenExpired and retry once.
    if (status === 401 && body?.error === 'TokenExpired' && !original._retry) {
      if (isRefreshing) {
        // Queue this request until the in-flight refresh completes.
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((token, err) => {
            if (err) return reject(err);
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const storedRefresh = localStorage.getItem('3dees_refresh_token');
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
          refreshToken: storedRefresh,
        });
        const { accessToken, refreshToken } = data.data;

        localStorage.setItem('3dees_access_token', accessToken);
        localStorage.setItem('3dees_refresh_token', refreshToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        notifySubscribers(accessToken, null);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshError) {
        notifySubscribers(null, refreshError);
        localStorage.removeItem('3dees_access_token');
        localStorage.removeItem('3dees_refresh_token');
        localStorage.removeItem('3dees_current_user');
        // Signal the app that the session has fully expired.
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalise every non-refresh error into a consistent shape.
    return Promise.reject({
      message: body?.message || error.message || 'An unexpected error occurred.',
      code: body?.error || 'ServerError',
      status,
    });
  }
);

export default api;
