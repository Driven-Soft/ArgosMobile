import axios from "axios";

import { API_BASE_URL } from "../config/api";

export const http = axios.create({
  baseURL: API_BASE_URL,
  // Timeout generoso por causa do cold start do Render (free tier): a primeira
  // request após ~15 min de inatividade pode levar 30–50s para acordar o serviço.
  timeout: 60000,
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
