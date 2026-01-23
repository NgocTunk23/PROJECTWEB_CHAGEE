import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api", // port Backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
