import axios from 'axios';

// Get base URL safely
const getBaseURL = () => {
  const url = import.meta.env.VITE_API_BASE_URL;

  if (url) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  // Local development
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }

  // Production fallback — don't crash
  console.warn('VITE_API_BASE_URL not set. API calls will fail.');
  return '';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Handle 401 (unauthorized)
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