import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const baseURL = `\( {apiUrl.replace(/\/ \)/, "")}/api/auth`; // remove trailing slash if present

console.log("[Auth API] Using baseURL:", baseURL);

const API_AUTH = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // optional – prevents hanging forever
});

export default API_AUTH;

