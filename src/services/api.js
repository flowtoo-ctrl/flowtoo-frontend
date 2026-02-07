// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api/auth`  // ✅ include /auth
    : 'http://localhost:5000/api/auth',           // ✅ local fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token automatically to every request (if exists)
API.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('flowtoo:user');

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const token = parsed.token || parsed.user?.token; // adjust if token is nested

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn('Failed to parse user data from localStorage:', e);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses globally
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