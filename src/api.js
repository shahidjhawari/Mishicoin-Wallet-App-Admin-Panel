import axios from "axios";

// Point this at your running Mishicoin backend
export const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the admin JWT (saved after login) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mishicoin_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
