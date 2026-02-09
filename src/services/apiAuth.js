import axios from "axios";

// Use env var if available, otherwise fallback to production backend
const apiUrl = import.meta.env.VITE_API_URL || "https://flowtoo-backend.onrender.com";

// Remove any trailing slash just in case
const cleanUrl = apiUrl.replace(/\/$/, "");

// Build the final base URL for auth endpoints
const baseURL = `${cleanUrl}/api/auth`;

console.log("VITE_API_URL from env:", import.meta.env.VITE_API_URL);      // debug: should show your Vercel env value or undefined
console.log("Final auth baseURL:", baseURL);                             // should show: https://flowtoo-backend.onrender.com/api/auth

const API_AUTH = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,          // 15 seconds – reasonable default
});

export default API_AUTH;