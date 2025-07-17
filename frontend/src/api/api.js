import { axiosInstance } from "./axiosConfig";

export const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data, config = {}) => axiosInstance.put(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),

  // Heritage
  getHeritageSiteById: (id) => axiosInstance.get(`/heritage/${id}`),

  // Festival
  getFestivals: () => axiosInstance.get("/festivals"),
  getFestivalById: (id) => axiosInstance.get(`/festivals/${id}`),
  addFestival: (data) => axiosInstance.post("/festivals", data),
  updateFestival: (id, data) => axiosInstance.put(`/festivals/${id}`, data),
  deleteFestival: (id) => axiosInstance.delete(`/festivals/${id}`),

  // Quiz
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
    return axiosInstance.get(`/quiz/leaderboard${query ? `?${query}` : ""}`);
  },
  getQuizFeedbackByCategory: (category) =>
    axiosInstance.get(`/quiz/feedback/category/${encodeURIComponent(category)}`),

  // Review
  submitReview: (data) => axiosInstance.post("/reviews", data),
  getReviewsByTarget: (targetType, targetId, page = 1, limit = 5) =>
    axiosInstance.get(`/reviews/${targetType}/${targetId}?page=${page}&limit=${limit}`),

  // Blog
  getBlogs: () => axiosInstance.get("/blogs"),
  getLatestBlogs: () => axiosInstance.get("/blogs/latest"),
  getBlogBySlug: (slug) => axiosInstance.get(`/blogs/${slug}`),
  addBlog: (data) => axiosInstance.post("/blogs", data),
  updateBlog: (id, data) => axiosInstance.put(`/blogs/${id}`, data),
  deleteBlog: (id) => axiosInstance.delete(`/blogs/${id}`),
};
