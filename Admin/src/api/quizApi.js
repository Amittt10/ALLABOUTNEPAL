import { axiosInstance } from "./axiosConfig";

export const api = {
  fetchQuizQuestions: () => axiosInstance.get("/admin/quiz"),
  getQuizQuestionById: (id) => axiosInstance.get(`/admin/quiz/${id}`),
  createQuizQuestion: (data) => axiosInstance.post("/admin/quiz", data),
  updateQuizQuestion: (id, data) => axiosInstance.put(`/admin/quiz/${id}`, data),
  deleteQuizQuestion: (id) => axiosInstance.delete(`/admin/quiz/${id}`),
};
