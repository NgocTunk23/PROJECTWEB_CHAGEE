import axios from 'axios';

const CART_KEY = 'my_cart_items';
const API_URL = 'http://localhost:8080/api';

export const CartService = {
  // 1. Lấy giỏ hàng (SỬA: Thêm dấu _ trước userId để tắt warning)
  getCart: (_userId?: string) => {
    const json = localStorage.getItem(CART_KEY);
    return json ? JSON.parse(json) : [];
  },

  // 2. Thêm vào giỏ (SỬA: Thêm dấu _ trước userId)
  addToCart: async (item: any, _userId?: string) => {
    let cart = CartService.getCart();
    
    // Logic thêm vào mảng
    cart.push(item);

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return item; 
  },

  // 3. Xóa món
  removeItem: async (indexOrId: number) => {
    let cart = CartService.getCart();
    
    if (typeof indexOrId === 'number' && indexOrId >= 0) {
       cart.splice(indexOrId, 1);
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return indexOrId;
  },
  
  // 4. Xóa sạch giỏ hàng
  clearCart: () => {
      localStorage.removeItem(CART_KEY);
  },

  // 5. Đặt hàng
  submitOrder: async (orderData: any) => {
      const token = localStorage.getItem('access_token'); // Lưu ý đúng tên key
      
      if (!token) {
          throw new Error("Vui lòng đăng nhập để đặt hàng!");
      }

      const config = {
          headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      };
      
      const response = await axios.post(`${API_URL}/orders/create`, orderData, config);
      
      CartService.clearCart();
      
      return response.data;
  }
};