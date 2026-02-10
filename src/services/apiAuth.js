import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "https://flowtoo-backend.onrender.com";

const baseURL = `\( {apiUrl.replace(/\/ \)/, "")}/api/auth`;

console.log("VITE_API_URL (env value):", import.meta.env.VITE_API_URL);
console.log("Auth API baseURL:", baseURL);

const API_AUTH = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export default API_AUTH;