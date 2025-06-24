import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // No global Content-Type header here, axios sets it automatically
});

// Manage token in headers and localStorage
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("adminToken", token);
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("adminToken");
  }
};

// Attach token to every request automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }

    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(new Error("Network error. Please check your connection."));
    }

    return Promise.reject(error);
  }
);

// Exported api object with all your API methods
export const api = {
  // Auth
  login: (credentials) => axiosInstance.post("/login", credentials),
  verifyToken: () => axiosInstance.get("/verify"),

  // Stats (needed by DashboardHome.jsx)
  getStats: () => axiosInstance.get("/admin/stats"),

  // Heritage
  getHeritage: (params = {}) => axiosInstance.get("/heritage", { params }),
  getAdminHeritage: (params = {}) => axiosInstance.get("/admin/heritage", { params }),
  getAdminHeritageById: (id) => axiosInstance.get(`/admin/heritage/${id}`),
  createHeritage: (data) =>
    axiosInstance.post("/admin/heritage", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    }),
  updateHeritage: (id, data) =>
    axiosInstance.put(`/admin/heritage/${id}`, data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    }),
  deleteHeritage: (id) => axiosInstance.delete(`/admin/heritage/${id}`),

  // Festivals
  fetchFestivals: () => axiosInstance.get("/festivals"),
  getFestivalById: (id) => axiosInstance.get(`/festivals/${id}`),
  createFestival: (data) =>
    axiosInstance.post("/admin/festivals", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    }),
  updateFestival: (id, data) =>
    axiosInstance.put(`/admin/festivals/${id}`, data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    }),
  deleteFestival: (id) => axiosInstance.delete(`/admin/festivals/${id}`),
};
