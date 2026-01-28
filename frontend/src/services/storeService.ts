import apiClient from "./apiClient";

// Interface trả về từ Java (Khớp với Branch.java)
export interface BranchAPI {
  branchid: string;
  addressU: string;
  // managerusername?: any; // Không cần thiết hiển thị
}

export const StoreService = {
  getAllStores: async (): Promise<BranchAPI[]> => {
    try {
      const response = await apiClient.get<BranchAPI[]>('/branches');
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách cửa hàng:", error);
      return [];
    }
  }
};