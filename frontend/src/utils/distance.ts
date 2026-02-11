// ============================================================================
// FILE: src/utils/distance.ts
// MÔ TẢ: Các hàm tiện ích để tính toán khoảng cách địa lý
// ============================================================================

/**
 * Hàm phụ trợ: Chuyển đổi độ (Degrees) sang Radian
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Tính khoảng cách giữa 2 tọa độ GPS theo đường chim bay (Công thức Haversine)
 * @param lat1 Vĩ độ điểm 1 (User)
 * @param lon1 Kinh độ điểm 1 (User)
 * @param lat2 Vĩ độ điểm 2 (Cửa hàng)
 * @param lon2 Kinh độ điểm 2 (Cửa hàng)
 * @returns Khoảng cách (đơn vị: km)
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Bán kính trái đất (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Khoảng cách (km)
  
  return d;
};

/**
 * Format hiển thị khoảng cách cho thân thiện với người dùng
 * - Nếu < 1km: Hiển thị mét (VD: 500m)
 * - Nếu >= 1km: Hiển thị km với 1 số lẻ (VD: 2.5km)
 * @param km Số km nhận được từ hàm calculateDistance
 */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};