import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "https://flowtoo-backend.onrender.com";

const baseURL = `\( {apiUrl.replace(/\/ \)/, "")}/api`;

console.log("VITE_API_URL (env value):", import.meta.env.VITE_API_URL);
console.log("General API baseURL:", baseURL);

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach token if user is logged in
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