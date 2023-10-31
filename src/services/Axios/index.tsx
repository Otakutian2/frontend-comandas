import { APP_ROUTES } from "@/routes";
import axios, { AxiosError } from "axios";
import https from "https";
import Router from "next/router";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const axiosObject = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  timeout: 20000,
  httpsAgent: agent,
});

axiosObject.interceptors.request.use((config) => {
  // Obtener el token JWT del almacenamiento local
  const authStorage = JSON.parse(localStorage.getItem("auth-storage") || "{}");

  if (Object.values(authStorage).length) {
    const accessToken = authStorage?.state?.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Agregar el token JWT al encabezado de autorización
    }
  }

  return config;
});

axiosObject.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.request.status === 401) {
      localStorage.removeItem("access_token");

      if (Router.pathname !== APP_ROUTES.login) {
        window.location.href = APP_ROUTES.login;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosObject;
