

const CART_KEY = 'my_cart_items';


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
  // 3. Xóa món (Gọi API xuống Java)
removeItem: async (id: string) => {
    const response = await fetch(`http://localhost:8080/api/cart-items/${id}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) throw new Error("Xóa thất bại");
    return id;
},

  // THÊM HÀM NÀY VÀO:
  updateQuantity: async (itemId: string | number, quantity: number) => {
    // Giả sử API backend của bạn là: PUT /api/cart-items/{id}?quantity=...
    // Hoặc gửi body JSON tùy theo cách bạn viết Backend
    const response = await fetch(`http://localhost:8080/api/cart-items/${itemId}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: quantity })
    });

    if (!response.ok) {
      throw new Error('Failed to update quantity');
    }

    return response.json();
  },

  clearCart: () => {
    // 1. Xóa trong LocalStorage
    localStorage.removeItem(CART_KEY);
    
    // 2. Nếu muốn gọi API xóa sạch giỏ hàng trên Server (Backend Spring Boot)
    // Bạn có thể mở comment dòng dưới nếu Backend có API này:
    // fetch('http://localhost:8080/api/cart/clear', { method: 'DELETE' });
  },

  // 5. Đặt hàng
  submitOrder: async (orderData: any) => {
      // BƯỚC 1: Lấy chuỗi JSON 'user' từ LocalStorage ra trước
    const userStr = localStorage.getItem('user'); 
    let token = '';

    if (userStr) {
        const userObj = JSON.parse(userStr); // Parse chuỗi thành Object
        token = userObj.token; // Lấy đúng key 'token' (như trong ảnh bạn chụp)
    }

    // BƯỚC 2: Gọi API với token vừa lấy được
    const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Gửi kèm token
        },
        body: JSON.stringify(orderData)
    });

    return response.json();
  }
};