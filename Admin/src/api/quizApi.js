import { axiosInstance } from "./axiosConfig";

const BASE_URL = "/admin/quiz";

export const getAllQuizQuestions = async () => {
  try {
    const res = await axiosInstance.get(BASE_URL);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch quiz questions:", error);
    throw error;
  }
};

export const getQuizQuestionById = async (id) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch quiz question with id ${id}:`, error);
    throw error;
  }
};

export const createQuizQuestion = async (data) => {
  try {
    const res = await axiosInstance.post(BASE_URL, data);
    return res.data;
  } catch (error) {
    console.error("Failed to create quiz question:", error);
    throw error;
  }
};

export const updateQuizQuestion = async (id, data) => {
  try {
    const res = await axiosInstance.put(`${BASE_URL}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Failed to update quiz question with id ${id}:`, error);
    throw error;
  }
};

export const deleteQuizQuestion = async (id) => {
  try {
    const res = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete quiz question with id ${id}:`, error);
    throw error;
  }
};
