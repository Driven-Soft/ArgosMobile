import axios from "axios";

import { API_BASE_URL } from "../config/api";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Normaliza erros para uma mensagem amigável. A API retorna ProblemDetails
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const problem = error.response?.data;
    const message =
      problem?.detail ??
      problem?.title ??
      error.message ??
      "Não foi possível conectar ao servidor.";
    return Promise.reject(new Error(message));
  },
);
