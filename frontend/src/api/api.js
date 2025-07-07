import { axiosInstance } from "./axiosConfig";

export const api = {
  // Heritage APIs
  getHeritageSiteById: (id) => axiosInstance.get(`/heritage/${id}`),

  // Festival APIs
  getFestivals: () => axiosInstance.get("/festivals"),
  getFestivalById: (id) => axiosInstance.get(`/festivals/${id}`),
  addFestival: (data) => axiosInstance.post("/festivals", data),
  updateFestival: (id, data) => axiosInstance.put(`/festivals/${id}`, data),
  deleteFestival: (id) => axiosInstance.delete(`/festivals/${id}`),

  // Quiz APIs
  getQuizQuestions: (category = "", difficulty = "") => {
    const query = [];
    if (category) query.push(`category=${encodeURIComponent(category)}`);
    if (difficulty) query.push(`difficulty=${encodeURIComponent(difficulty)}`);
    const queryString = query.length ? `?${query.join("&")}` : "";
    return axiosInstance.get(`/quiz${queryString}`);
  },

  getQuizQuestionById: (id) => axiosInstance.get(`/quiz/${id}`),
  submitQuizResult: (data) => axiosInstance.post("/quiz/submit", data),
  submitQuizFeedback: (data) => axiosInstance.post("/quiz/feedback", data), 
  getUserProgress: (userId) => axiosInstance.get(`/quiz/progress/${userId}`),

  getLeaderboard: (params = {}) => {
    const query = Object.entries(params)
      .filter(([_, v]) => v && v.trim() !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    const queryString = query ? `?${query}` : "";
    return axiosInstance.get(`/quiz/leaderboard${queryString}`);
  },

    getQuizFeedbackByCategory: (category) =>
    axiosInstance.get(`/quiz/feedback/category/${encodeURIComponent(category)}`),
};
