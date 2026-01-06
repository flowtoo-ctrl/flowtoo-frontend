import axios from "axios";

const getBaseURL = () => {
  // Read env safely
  const envUrl = import.meta.env?.VITE_API_BASE_URL;

  // If missing, DO NOT crash app
  if (!envUrl) {
    console.warn("VITE_API_BASE_URL missing, using fallback");
    return "https://flowtoo-backend.onrender.com";
  }

  // Ensure protocol
  if (!envUrl.startsWith("http")) {
    return `https://${envUrl}`;
  }

  return envUrl.replace(/\/$/, "");
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Token interceptor (safe)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;