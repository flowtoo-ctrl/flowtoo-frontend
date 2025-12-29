// src/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',  // fallback for safety
  // You can add headers, timeout, etc. here
});

export default apiClient;