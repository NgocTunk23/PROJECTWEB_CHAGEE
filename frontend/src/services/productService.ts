import apiClient from "./apiClient";

// Định nghĩa kiểu dữ liệu khớp với Entity Product trong Java
export interface ProductAPI {
  productId: string;
  productName: string;
  displayPrice: number;
  productImage: string;
  description: string;
  category: string;
  soldQuantity?: number; // Dấu ? nghĩa là có thể null
}

export const ProductService = {
  // Lấy danh sách tên các danh mục (để hiện cột bên trái)
  getCategories: async () => {
    const response = await apiClient.get<string[]>("/products/categories");
    return response.data;
  },

  // Lấy sản phẩm (có thể lọc theo category hoặc lấy hết)
  getProducts: async (category?: string) => {
    // Nếu có category thì thêm vào URL, nếu không thì gọi lấy tất cả
    const url = category 
      ? `/products?category=${encodeURIComponent(category)}` 
      : "/products";
      
    const response = await apiClient.get<ProductAPI[]>(url);
    return response.data;
  }
};