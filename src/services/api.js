// src/services/api.js
import axios from "axios";

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (!envUrl) {
    console.warn("VITE_API_URL missing, using fallback");
    return "https://flowtoo-backend.onrender.com/api";
  }

  let cleanUrl = envUrl.startsWith("http")
    ? envUrl
    : `https://${envUrl}`;

  return cleanUrl.replace(/\/$/, "") + "/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("flowtoo:user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const token = parsed.token || parsed.user?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;