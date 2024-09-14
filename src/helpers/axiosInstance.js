// axiosInstance.js
import axios from "axios";

const token = localStorage.getItem("token");

export const Axios = axios.create({
  baseURL: "https://n55tyhknxc.execute-api.us-west-2.amazonaws.com/dev/", // Replace with your API's base URL
  // baseURL: "http://localhost:3000/dev/",
  timeout: 20000, // Timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
    "Authorization": `${token}`,
    // You can add any custom headers here
  },
});

export const AxiosForm = axios.create({
  baseURL: "https://n55tyhknxc.execute-api.us-west-2.amazonaws.com/dev/", // Replace with your API's base URL
  // baseURL: "http://localhost:3000/dev/",
  timeout: 20000, // Timeout in milliseconds
  headers: {
    "Content-Type": "multipart/form-data",
    "Authorization": `${token}`,
    // You can add any custom headers here
  },
});
