import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
});

export const getProductos = async (params = {}) => {
  const { data } = await apiClient.get('/productos', { params });
  return data;
};

export const getCategorias = async () => {
  const { data } = await apiClient.get('/categorias');
  return data;
};

export const getProductoPorId = async (id) => {
  const { data } = await apiClient.get(`/productos/${id}`);
  return data;
};
