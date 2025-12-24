import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

API.interceptors.request.use((config) => {
  const profile = localStorage.getItem("profile");
  if (profile) {
    try {
      const parsed = JSON.parse(profile);
      const token = parsed.token || parsed.user?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) { }
  }
  return config;
});

export default API;