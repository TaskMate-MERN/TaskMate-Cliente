import { api } from '../lib/axios';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/user/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Error al iniciar sesión');
  }
};

export const register = async (userData: { email: string; password: string; name: string }) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    throw new Error('Error al registrar el usuario');
  }
};