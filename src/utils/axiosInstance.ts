import axios from "axios";

const axiosConfig = {
  baseURL: "http://localhost:3000/api",
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
