// src/services/apiService.js
import axios from "axios";

// Create axios instance
const apiService = axios.create({
  baseURL: "http://localhost:5000/api", // backend ka URL
});

// Automatically attach token to every request if logged in
apiService.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default apiService;
