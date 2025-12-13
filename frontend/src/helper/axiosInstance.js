import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: `http://localhost:3000/api/v1`,
  baseURL: `https://poll-app-c1hs.onrender.com/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
