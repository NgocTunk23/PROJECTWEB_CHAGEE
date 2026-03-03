// 1. Định nghĩa Interface để dùng cho toàn App
export interface Voucher { 
  vouchercode: string;
  vouchername: string;
  discountamount: number;
  discountpercentage: number;
  minordervalue: number;
  expirydate: string;
  usage_left: number; // ✅ THÊM DÒNG NÀY
}

const BASE_URL = 'http://localhost:8080/api/vouchers';

// Trong services/voucherService.ts
export const VoucherService = {
  /**
   * ✅ LẤY VOUCHER CHUNG (Dùng cho Homepage)
   * Giữ nguyên 2 tham số (category, token) để không làm hỏng HomePage.tsx
   */
  getVouchers: async (category: string = 'all', token?: string): Promise<Voucher[]> => {
    try {
      // URL này lấy toàn bộ mã còn hạn trong hệ thống
      const url = `http://localhost:8080/api/vouchers?category=${encodeURIComponent(category)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }) // Gửi token nếu có
        }
      });

      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Lỗi HomePage Voucher:", error);
      return [];
    }
  },

  /**
   * ✅ LẤY VOUCHER CÁ NHÂN (Dùng cho Giỏ hàng)
   * Chỉ lấy những mã mà User này CHƯA dùng
   */
  getAvailableVouchers: async (username: string, token: string): Promise<Voucher[]> => {
    try {
      const url = `http://localhost:8080/api/vouchers/available?username=${encodeURIComponent(username)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  }
};  