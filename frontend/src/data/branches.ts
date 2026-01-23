// Dữ liệu chi nhánh từ database SQL - Bảng Branches
export interface Branch {
  branch_id: string;
  branch_name: string;
  addressU: string;
  manager_username: string;
  prepTime?: string; // Thời gian chuẩn bị ước tính
  distance?: string; // Khoảng cách (sẽ tính động sau)
}

export const branches: Branch[] = [
  {
    branch_id: 'CHAGEE_LBB',
    branch_name: 'CHAGEE LŨY BÁN BÍCH',
    addressU: '462 Lũy Bán Bích, Phường Tân Phú, TP. HCM',
    manager_username: 'manager01',
    prepTime: '6 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_TSN',
    branch_name: 'CHAGEE TÂN SƠN NHÌ',
    addressU: '369A Tân Sơn Nhì, Phường Phú Thọ Hoà, TP. HCM',
    manager_username: 'manager01',
    prepTime: '1 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_NTB',
    branch_name: 'CHAGEE NGUYỄN THÁI BÌNH',
    addressU: '162 Nguyễn Thái Bình, Phường Nguyễn Thái Bình, TP. HCM',
    manager_username: 'manager01',
    prepTime: '5 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_MPL',
    branch_name: 'CHAGEE mPLAZA',
    addressU: 'GF02, Tầng Trệt mPlaza, 39 Lê Duẩn, Phường Sài Gòn, TP. HCM',
    manager_username: 'manager01',
    prepTime: '8 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_VGP',
    branch_name: 'CHAGEE VINHOMES GRAND PARK',
    addressU: '101.S05 Vinhomes Grand Park, 88 Phước Thiên, Long Bình, TP. HCM',
    manager_username: 'manager01',
    prepTime: '10 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_BC',
    branch_name: 'CHAGEE BÀU CÁT',
    addressU: '133-135 Bàu Cát, Phường Tân Bình, TP. HCM',
    manager_username: 'manager01',
    prepTime: '0 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_PQ',
    branch_name: 'CHAGEE PHỔ QUANG',
    addressU: '119G-119H Phổ Quang, Phường Đức Nhuận, TP. HCM',
    manager_username: 'manager01',
    prepTime: '7 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_HG',
    branch_name: 'CHAGEE HẬU GIANG',
    addressU: '584-586-588 Hậu Giang, Phường Phú Lâm, TP. HCM',
    manager_username: 'manager01',
    prepTime: '5 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_NGT',
    branch_name: 'CHAGEE NGUYỄN GIA TRÍ',
    addressU: '116 Nguyễn Gia Trí, Phường Bình Thạnh, TP. HCM',
    manager_username: 'manager01',
    prepTime: '4 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_VHM',
    branch_name: 'CHAGEE VẠN HẠNH MALL',
    addressU: 'Tầng 1, Vị trí 1-20 Vạn Hạnh Mall, 11 Sư Vạn Hạnh, Phường Hòa Hưng, TP. HCM',
    manager_username: 'manager01',
    prepTime: '9 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_VCP',
    branch_name: 'CHAGEE VINHOMES CENTRAL PARK',
    addressU: 'Vinhomes Central Park C1.SH06, Điện Biên Phủ, Bình Thạnh, TP. HCM',
    manager_username: 'manager01',
    prepTime: '6 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_CAT',
    branch_name: 'CHAGEE CATAVIL',
    addressU: 'Catavil An Phú, 01 Đường Song Hành, Phường Bình Trưng, TP. HCM',
    manager_username: 'manager01',
    prepTime: '11 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_NT',
    branch_name: 'CHAGEE NGUYỄN TRÃI',
    addressU: '440 Nguyễn Trãi, Phường An Đông, TP. Hồ Chí Minh',
    manager_username: 'manager01',
    prepTime: '3 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_LTT',
    branch_name: 'CHAGEE LÝ TỰ TRỌNG',
    addressU: '200A Lý Tự Trọng, Phường Bến Thành, TP. HCM',
    manager_username: 'manager01',
    prepTime: '5 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_LVS',
    branch_name: 'CHAGEE LÊ VĂN SỸ',
    addressU: '236A Lê Văn Sỹ, Phường Tân Sơn Hoà, TP. HCM',
    manager_username: 'manager01',
    prepTime: '7 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_LHP',
    branch_name: 'CHAGEE LÊ HỒNG PHONG',
    addressU: '178-180 Lê Hồng Phong, Phường Chợ Quán, TP. HCM',
    manager_username: 'manager01',
    prepTime: '4 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_PXL',
    branch_name: 'CHAGEE PHAN XÍCH LONG',
    addressU: '181 Phan Xích Long, Phường Cầu Kiệu, TP. HCM',
    manager_username: 'manager01',
    prepTime: '6 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_CMT8',
    branch_name: 'CHAGEE CMT8',
    addressU: '66B Cách Mạng Tháng 8, P.Xuân Hoà, TP.HCM',
    manager_username: 'manager01',
    prepTime: '8 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_DK',
    branch_name: 'CHAGEE ĐỒNG KHỞI',
    addressU: '131 Đồng Khởi, Phường Bến Nghé, TP. HCM',
    manager_username: 'manager01',
    prepTime: '3 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_NTMK',
    branch_name: 'CHAGEE NGUYỄN THỊ MINH KHAI',
    addressU: '185 Nguyễn Thị Minh Khai, Phường Bến Thành, TP. HCM',
    manager_username: 'manager01',
    prepTime: '5 Phút',
    distance: '-m'
  },
  {
    branch_id: 'CHAGEE_NDC',
    branch_name: 'CHAGEE NGUYỄN ĐỨC CẢNH',
    addressU: '59 Nguyễn Đức Cảnh, Phường Tân Hưng, TP. HCM',
    manager_username: 'manager01',
    prepTime: '9 Phút',
    distance: '-m'
  }
];
