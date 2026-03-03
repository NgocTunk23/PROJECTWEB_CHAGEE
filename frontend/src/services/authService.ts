import axios from 'axios';

// 1. Định nghĩa Interface khớp 100% với JwtResponse bên Java của ông
export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  role: string;
  rewardpoints: number;
  fullname: string;
  phonenumber: string; // ✅ TRƯỜNG DỮ LIỆU ÔNG VỪA THÊM ĐÂY NÈ!
}

const API_URL = 'http://localhost:8080/api'; 

export const AuthService = {
  // 2. Cập nhật hàm Login để trả về đúng kiểu dữ liệu
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    // Trả về dữ liệu thô từ Backend (JwtResponse)
    return response.data; 
  },

  // 3. Đăng ký
  register: async (data: any) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },
  
  // 4. Lấy danh sách cửa hàng
  getStores: async () => {
    const response = await axios.get(`${API_URL}/stores`);
    return response.data; 
  }
};