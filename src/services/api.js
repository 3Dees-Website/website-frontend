import axios from 'axios';

// In development VITE_API_BASE_URL is empty — Vite's dev-proxy handles /api/*.
// In production set VITE_API_BASE_URL to your domain (e.g. https://api.3dees.com).
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '') + '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ── Response interceptor — normalise errors ────────────────────────────────
// Every endpoint this site calls is public, so no Authorization header is
// sent and auth storage is never read — it belongs to the admin dashboard.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const body = error.response?.data;
    const status = error.response?.status;

    // Normalise every error into a consistent shape.
    return Promise.reject({
      message: body?.message || error.message || 'An unexpected error occurred.',
      code: body?.error || 'ServerError',
      status,
    });
  }
);

export default api;
