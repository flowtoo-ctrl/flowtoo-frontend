import axios from "axios";

const baseURL = "https://flowtoo-backend.onrender.com/api/auth";

console.log("Auth API using hard-coded baseURL:", baseURL);

const API_AUTH = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export default API_AUTH;