import axios from "axios";

// Point this at your running Mishicoin backend.
// Set VITE_API_BASE_URL in .env to override (defaults to production).
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://mishicoinbackend.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the admin JWT (obtained via silent auto-login, see App.jsx) to
// every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mishicoin_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
