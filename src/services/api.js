// src/services/api.js   ← keep it .js (no JSX here)
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'http://localhost:5000/api',  // local fallback with /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token automatically to every request (if exists)
API.interceptors.request.use(
  (config) => {
    // Use the key that matches what you store in AuthContext
    // In your AuthContext you use "flowtoo:user", so update here:
    let userData = localStorage.getItem('flowtoo:user');

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const token = parsed.token || parsed.user?.token;  // adjust if token is nested differently

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn('Failed to parse user data from localStorage:', e);
        // Optional: localStorage.removeItem('flowtoo:user');
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses globally (optional but useful)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Unauthorized — token may be invalid or expired');
      // Optional: clear storage and redirect to login
      // localStorage.removeItem('flowtoo:user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;