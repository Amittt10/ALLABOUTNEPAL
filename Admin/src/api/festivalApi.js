// src/api/festivalApi.js
import { axiosInstance } from './axiosConfig';

export const fetchFestivals = async () => {
  const { data } = await axiosInstance.get('/festivals');
  return data;
};

export const fetchFestivalById = async (id) => {
  const { data } = await axiosInstance.get(`/festivals/${id}`);
  return data;
};

export const addFestival = async (festivalData) => {
  const { data } = await axiosInstance.post('/admin/festivals', festivalData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const updateFestival = async (id, festivalData) => {
  const { data } = await axiosInstance.put(`/admin/festivals/${id}`, festivalData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteFestival = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/festivals/${id}`);
  return data;
};
