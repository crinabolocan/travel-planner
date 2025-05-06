// src/api/tripApi.js
import axios from "axios";

const tripApi = axios.create({
  baseURL: "http://localhost:5010",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adaugă tokenul la fiecare cerere
tripApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default tripApi;
