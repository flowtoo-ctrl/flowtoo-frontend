import axios from "axios";

const baseURL = "https://flowtoo-backend.onrender.com/api";

console.log("General API using hard-coded baseURL:", baseURL);

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Token interceptor
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("flowtoo:user");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (err) {
      console.warn("Invalid user data in localStorage", err);
    }
  }
  return config;
});

export default API;