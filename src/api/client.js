import axios from 'axios';

// Safe way to get the API base URL
const getBaseURL = () => {
  // First, try the Vite environment variable (set in Vercel)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Fallback for local development
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }

  // Final fallback for production if variable is missing (prevents crash)
  console.error('VITE_API_BASE_URL is not defined. Using root "/" as fallback.');
  return '/'; // This prevents the app from crashing — API calls will fail gracefully
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;