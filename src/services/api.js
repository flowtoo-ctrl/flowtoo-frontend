// src/services/api.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : "https://flowtoo-backend.onrender.com";

const baseURL = `\( {apiUrl.replace(/\/ \)/, "")}/api`;  // removes trailing slash if present

console.log("[General API] Using baseURL:", baseURL);

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage if available
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