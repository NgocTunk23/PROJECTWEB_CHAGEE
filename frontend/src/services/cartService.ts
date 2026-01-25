import axios from 'axios';

// Định nghĩa kiểu dữ liệu đầu vào cho việc thêm giỏ hàng
// (Interface này khớp với cấu trúc object bạn gửi từ MenuPage)
export interface CartItemAPI {
  store: { id: string };
  product: { id: string };
  quantity: number;
  price: number;
  size: string;
  sugar: string;
  ice: string;
  toppings: string[];
}

const API_URL = 'http://localhost:8080/api'; 

export const CartService = {
  // 1. Lấy giỏ hàng
  getCart: async (userId: string) => {
    const response = await axios.get(`${API_URL}/cart`, {
      params: { user_id: userId }
    });
    return response.data;
  },

  // 2. Thêm vào giỏ (ĐÃ SỬA: Dùng CartItemAPI thay vì any)
  addToCart: async (item: CartItemAPI, userId: string) => {
    const payload = {
      user_id: userId,
      store_id: item.store.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.price,
      options: {
        size: item.size,
        sugar: item.sugar,
        ice: item.ice,
        toppings: item.toppings
      }
    };
    const response = await axios.post(`${API_URL}/cart/add`, payload);
    return response.data;
  },

  // 3. Cập nhật số lượng
  updateQuantity: async (cartItemId: string, quantity: number) => {
    const response = await axios.put(`${API_URL}/cart/${cartItemId}`, {
      quantity: quantity
    });
    return response.data;
  },

  // 4. Xóa món
  removeItem: async (cartItemId: string) => {
    await axios.delete(`${API_URL}/cart/${cartItemId}`);
    return cartItemId;
  }
};