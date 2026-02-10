const CART_KEY = 'my_cart_items';
const API_URL = 'http://localhost:8080/api';

// Hàm phụ lấy Token
const getHeaders = () => {
  const userStr = localStorage.getItem('user');
  const token = userStr ? JSON.parse(userStr).token : '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const CartService = {
  // 1. Lấy giỏ hàng
  getCart: (_userId?: string) => {
    const json = localStorage.getItem(CART_KEY);
    return json ? JSON.parse(json) : [];
  },

  // 2. Thêm vào giỏ (SỬA LẠI: Chuẩn hóa tên đá/đường để gộp tốt hơn)
  addToCart: async (item: any, _userId?: string) => {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    
    // Hàm chuẩn hóa chuỗi (Bỏ chữ 'Đá', 'Đường' thừa để so sánh)
    // Ví dụ: "Đá bình thường" -> "bình thường", "Bình thường" -> "bình thường"
    const normalize = (str: string) => {
        if (!str) return '';
        return str.toLowerCase()
            .replace('đá ', '')
            .replace('đường ', '')
            .trim();
    };

    const existingIndex = cart.findIndex((i: any) => 
        i.product.id === item.product.id && 
        i.size === item.size && 
        // So sánh sau khi đã chuẩn hóa
        normalize(i.sugar) === normalize(item.sugar) && 
        normalize(i.ice) === normalize(item.ice)
    );

    if (existingIndex > -1) {
        // CỘNG DỒN SỐ LƯỢNG
        const oldQuantity = Number(cart[existingIndex].quantity);
        const addQuantity = Number(item.quantity);
        cart[existingIndex].quantity = oldQuantity + addQuantity;
        
        // (Tùy chọn) Cập nhật lại tên option cho đồng nhất với cái mới nhất
        cart[existingIndex].ice = item.ice;
        cart[existingIndex].sugar = item.sugar;
    } else {
        // THÊM MỚI
        if (!item.id) item.id = `cart_${Date.now()}_${Math.random()}`; 
        item.quantity = Number(item.quantity);
        cart.push(item);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return item;
  },

  // 3. Xóa món
  removeItem: async (itemId: string) => {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    cart = cart.filter((item: any) => item.id !== itemId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return Promise.resolve(itemId);
  },

  // 4. Cập nhật số lượng (+ / -)
  updateQuantity: async (itemId: string, quantity: number) => {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    
    const index = cart.findIndex((item: any) => item.id === itemId);
    if (index > -1) {
        const newQuantity = Number(quantity);
        if (newQuantity <= 0) {
            cart.splice(index, 1); // Xóa nếu về 0
        } else {
            cart[index].quantity = newQuantity; // Cập nhật số lượng mới
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
    return Promise.resolve(cart);
  },

  // 5. Gửi đơn hàng lên Server
  submitOrder: async (orderData: any) => {
     const response = await fetch(`${API_URL}/orders/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Đặt hàng thất bại");
    }
    
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
  },

  // 6. Xóa sạch giỏ hàng
  clearCart: () => {
    localStorage.removeItem(CART_KEY);
  }
};