import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL base de la API
});