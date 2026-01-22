import axios from "axios";

const api = axios.create({
  baseURL: "https://task-management-backend-tgvp.onrender.com",
});

export default api;
