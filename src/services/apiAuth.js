import axios from "axios";

const API_AUTH = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/auth`
    : "https://flowtoo-backend.onrender.com/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API_AUTH;

