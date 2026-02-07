import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("flowtoo:user");
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export default API;

