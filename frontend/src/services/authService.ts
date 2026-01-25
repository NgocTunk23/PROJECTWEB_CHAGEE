import axios from 'axios';

// Cấu hình URL backend là port 8080
const API_URL = 'http://localhost:8080/api'; 

export const AuthService = {
  // 1. Đăng nhập
  login: async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    return response.data; 
  },

  // 2. Đăng ký
  register: async (data: any) => {
    // API backend của bạn cần endpoint này, nếu chưa có thì phải viết thêm bên Java
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },
  
  // 3. Lấy danh sách cửa hàng
  getStores: async () => {
    const response = await axios.get(`${API_URL}/stores`);
    return response.data; 
  }
};