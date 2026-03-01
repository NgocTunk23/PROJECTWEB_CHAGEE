export const VoucherService = {
  getVouchers: async (category?: string, token?: string) => {
    const url = category 
      ? `http://localhost:8080/api/vouchers?category=${encodeURIComponent(category)}` 
      : `http://localhost:8080/api/vouchers`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // ✅ Thêm Authorization để Spring Security cho qua
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }
};