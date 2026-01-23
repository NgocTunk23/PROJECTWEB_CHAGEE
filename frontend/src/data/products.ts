// Dữ liệu sản phẩm từ database SQL - Bảng Products
export interface Product {
  product_id: string;
  product_name: string;
  product_image: string | null;
  display_price: number;
  category: string;
  descriptionU: string;
  sold_quantity: number;
  approved_by: string;
}

export const products: Product[] = [
  {
    product_id: 'P01',
    product_name: 'Trà Sữa Xanh Nhài',
    product_image: 'https://images.unsplash.com/photo-1646325825271-0769c399e3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 69000,
    category: 'Trà Sữa Tươi Nguyên Lá',
    descriptionU: 'Trà sữa xanh nhài thơm mát, hậu vị tinh tế',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P02',
    product_name: 'Trà Sữa Ô Long Quế Hoa',
    product_image: 'https://images.unsplash.com/photo-1626868180792-4871c3ecaadb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 71000,
    category: 'Trà Sữa Tươi Nguyên Lá',
    descriptionU: 'Trà ô long phối hoa quế, vị ngọt thanh tao',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P03',
    product_name: 'Trà Sữa Thiết Quan Âm',
    product_image: 'https://images.unsplash.com/photo-1637273484093-3e205aed2c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 68000,
    category: 'Trà Sữa Tươi Nguyên Lá',
    descriptionU: 'Trà Thiết Quan Âm hương trà tinh tế, hậu vị mượt mà',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P04',
    product_name: 'Trà Sữa Xanh Nếp',
    product_image: 'https://images.unsplash.com/photo-1640355440666-fce1efeef912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 67000,
    category: 'Trà Sữa Tươi Nguyên Lá',
    descriptionU: 'Trà xanh nếp độc đáo, hòa quyện sữa tươi chất lượng',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P05',
    product_name: 'Trà Sữa Đại Hồng Bào',
    product_image: 'https://images.unsplash.com/photo-1613019435367-6adf98fb2e44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 75000,
    category: 'Trà Sữa Tươi Nguyên Lá',
    descriptionU: 'Trà sữa Đại Hồng Bào đậm đà, hương sắc sâu lắng',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P06',
    product_name: 'Trà Sữa Phổ Nhĩ Hoa Hồng',
    product_image: 'https://images.unsplash.com/photo-1646325825271-0769c399e3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 78000,
    category: 'Trà Sữa Tươi Nguyên Lá',
    descriptionU: 'Trà Phổ Nhĩ kết hợp hoa hồng đỏ, vị mịn màng',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P07',
    product_name: 'Trà Sữa Đen Mộc Khói',
    product_image: 'https://images.unsplash.com/photo-1637273484093-3e205aed2c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 70000,
    category: 'Trà Sữa Tươi Nguyên Lá',
    descriptionU: 'Trà sữa đen mộc khói, cân bằng vị đậm và nhẹ',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P08',
    product_name: 'Trà Nguyên Bản Đại Hồng Bào',
    product_image: 'https://images.unsplash.com/photo-1626868180792-4871c3ecaadb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 59000,
    category: 'Trà Nguyên Bản',
    descriptionU: 'Trà nguyên bản Đại Hồng Bào, hương vị trà thuần túy',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P09',
    product_name: 'Trà Nguyên Bản Ô Long Quế Hoa',
    product_image: 'https://images.unsplash.com/photo-1626868180792-4871c3ecaadb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 60000,
    category: 'Trà Nguyên Bản',
    descriptionU: 'Trà ô long quế hoa, thơm mát tự nhiên',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P10',
    product_name: 'Teaspresso Latte Đại Hồng Bào',
    product_image: 'https://images.unsplash.com/photo-1637273484093-3e205aed2c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 69000,
    category: 'Teaspresso Latte',
    descriptionU: 'Trà Latte Đại Hồng Bào, vị đậm, béo nhẹ',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P11',
    product_name: 'Teaspresso Latte Mộc Khói',
    product_image: 'https://images.unsplash.com/photo-1637273484093-3e205aed2c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 69000,
    category: 'Teaspresso Latte',
    descriptionU: 'Trà Latte Mộc Khói, hương vị khói đặc trưng',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P12',
    product_name: 'Teaspresso Frappé Phổ Nhĩ Oreo',
    product_image: 'https://images.unsplash.com/photo-1640355440666-fce1efeef912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 79000,
    category: 'Teaspresso Frappé',
    descriptionU: 'Frappé Phổ Nhĩ kết hợp Oreo, thơm ngọt',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P13',
    product_name: 'Teaspresso Frappé Đại Hồng Bào Caramel',
    product_image: 'https://images.unsplash.com/photo-1640355440666-fce1efeef912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 78000,
    category: 'Teaspresso Frappé',
    descriptionU: 'Frappé Đại Hồng Bào với caramel, béo mịn',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P14',
    product_name: 'Trà Sữa Snow Cap Đại Hồng Bào',
    product_image: 'https://images.unsplash.com/photo-1640355440666-fce1efeef912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 75000,
    category: 'Trà Sữa Snow Cap',
    descriptionU: 'Trà sữa Snow Cap lớp kem tươi, vị sảng khoái',
    sold_quantity: 0,
    approved_by: 'manager01'
  },
  {
    product_id: 'P15',
    product_name: 'Trà Sữa Snow Cap Oolong Quế Hoa',
    product_image: 'https://images.unsplash.com/photo-1640355440666-fce1efeef912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    display_price: 76000,
    category: 'Trà Sữa Snow Cap',
    descriptionU: 'Trà sữa Snow Cap Oolong Quế Hoa, thơm nhẹ, mịn màng',
    sold_quantity: 0,
    approved_by: 'manager01'
  }
];

// Lấy tất cả categories unique
export const getCategories = (): string[] => {
  return Array.from(new Set(products.map(p => p.category)));
};

// Lọc sản phẩm theo category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category);
};
