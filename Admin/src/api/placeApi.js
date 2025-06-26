// src/api/placeApi.js
import { axiosInstance } from './axiosConfig';

export const placeApi = {
  getPlaces: () => axiosInstance.get('/places'),
  getPlaceById: (id) => axiosInstance.get(`/places/${id}`),
  addPlace: (data) => axiosInstance.post('/places', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  updatePlace: (id, data) => axiosInstance.put(`/places/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  deletePlace: (id) => axiosInstance.delete(`/places/${id}`),
};
