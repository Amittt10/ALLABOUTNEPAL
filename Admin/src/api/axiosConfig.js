import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // Removed global "Content-Type" header to allow axios/browser to set it dynamically
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("adminToken", token);
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("adminToken");
  }
};

// Attach token for every request
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

// Handle 401s globally
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

// API methods
export const api = {
  // Auth
  login: (credentials) => axiosInstance.post("/login", credentials),
  verifyToken: () => axiosInstance.get("/verify"),

  // Heritage
  getHeritage: (params = {}) => axiosInstance.get("/heritage", { params }),

  // Admin Heritage
  getAdminHeritage: (params = {}) => axiosInstance.get("/admin/heritage", { params }),
  getAdminHeritageById: (id) => axiosInstance.get(`/admin/heritage/${id}`),

  createHeritage: (data) =>
    axiosInstance.post("/admin/heritage", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    }),

 updateHeritage: (id, data) =>
  axiosInstance.put(`/admin/heritage/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),


  deleteHeritage: (id) => axiosInstance.delete(`/admin/heritage/${id}`),

  // Stats
  getStats: () => axiosInstance.get("/admin/stats"),
};
