// E:\devalayaum\frontend\src\utils\api.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = () => {
  const token = localStorage.getItem("adminToken");
  return axios.create({
    baseURL: BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
