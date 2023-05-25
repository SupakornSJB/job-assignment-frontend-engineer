import axios from "axios";

const axiosConfig = {
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 5000,
};

export const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
