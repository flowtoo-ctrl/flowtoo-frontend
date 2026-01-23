// src/services/api.js   ← keep it .js (no JSX here)
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',  // fallback for local dev
  // timeout: 10000,           // optional: add if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token automatically to every request (if exists)
API.interceptors.request.use(
  (config) => {
    let profile = localStorage.getItem('profile');  // or 'flowtoo:user' — match what you use in AuthContext

    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        const token = parsed.token || parsed.user?.token;  // adjust based on your stored shape

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn('Failed to parse profile from localStorage:', e);
        // Optionally: localStorage.removeItem('profile');
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: response interceptor (good for handling 401/403 globally)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Optional: logout user, redirect to login
      console.warn('Unauthorized — token may be invalid/expired');
      // localStorage.removeItem('profile');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

