import apiClient from "./apiClient";

// Trong file productService.ts hoặc nơi khai báo interface
export interface ProductAPI {
    productid: string;      // Sửa productId -> productid
    productname: string;    // Sửa productName -> productname
    description: string;   // Sửa description -> descriptionU (như bạn đã thấy ở bước trước)
    displayprice: number;   // Sửa displayPrice -> displayprice
    productimage: string;   // Sửa productImage -> productimage
    category: string;
    soldquantity?: number;  // Sửa soldQuantity -> soldquantity
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