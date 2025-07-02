import axios from "./axiosConfig";

const BASE_URL = "/api/places";

export const getAllPlaces = () => axios.get(BASE_URL);

export const getPlaceById = (id) => axios.get(`${BASE_URL}/${id}`);

export const createPlace = (formData, token) =>
  axios.post(BASE_URL, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updatePlace = (id, formData, token) =>
  axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deletePlace = (id, token) =>
  axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
