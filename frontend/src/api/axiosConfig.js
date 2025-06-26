import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  //timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  getHeritageSiteById: (id) => axiosInstance.get(`/heritage/${id}`),

  // Festival APIs:
  getFestivals: () => axiosInstance.get("/festivals"),
  getFestivalById: (id) => axiosInstance.get(`/festivals/${id}`),
  
  // For admin panel (if needed)
  addFestival: (data) => axiosInstance.post("/festivals", data),
  updateFestival: (id, data) => axiosInstance.put(`/festivals/${id}`, data),
  deleteFestival: (id) => axiosInstance.delete(`/festivals/${id}`),
};
