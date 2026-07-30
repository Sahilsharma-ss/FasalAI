import axios from "axios";

let rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// Remove trailing slash if present
if (rawBaseURL.endsWith("/")) {
  rawBaseURL = rawBaseURL.slice(0, -1);
}
// Automatically append /api if user omitted it in VITE_API_URL environment variable
if (!rawBaseURL.endsWith("/api")) {
  rawBaseURL += "/api";
}

const api = axios.create({
  baseURL: rawBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fasalai_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
