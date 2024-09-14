import axios from "axios";
import REACT_APP_BACKEND_URL  from "./config/urls";
const request = axios.create({
  baseURL: REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    crossdomain: true,
  },
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-access-token"] = `${token}`;
  }
  return config;
});

export default request;
