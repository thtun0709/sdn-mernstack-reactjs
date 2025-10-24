import axios from 'axios';

// Base URL for API (includes /api path)
const baseURL = process.env.REACT_APP_API_BASE || 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Host root for building absolute URLs for images/static files
const apiHost = baseURL.replace(/\/api\/?$/, '');

/**
 * Build a full URL for assets returned by the backend (images, uploads).
 * If the passed path is already absolute (starts with http), return it unchanged.
 * If it's a root-relative path (starts with '/'), prefix with apiHost.
 */
function assetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/')) return apiHost + path;
  return apiHost + '/' + path;
}

export { apiHost, assetUrl };
export default api;
