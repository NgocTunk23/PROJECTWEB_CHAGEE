import { Product } from '../App';
import { Plus } from 'lucide-react';

interface MenuSectionProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: any) => void;
}

export function MenuSection({ products, onProductClick, onAddToCart }: MenuSectionProps) {
  // Trích xuất danh sách các Category duy nhất
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-12 pb-20">
      {categories.map(category => {
        const categoryProducts = products.filter(p => p.category === category);
        
        return (
          <div key={category} className="px-4 lg:px-0">
            {/* Tên danh mục */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-orange-500 inline-block">
              {category}
            </h3>
            
            {/* Danh sách sản phẩm dạng lưới */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => onProductClick(product)}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden cursor-pointer transform transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* Khu vực hình ảnh */}
                  <div className="relative h-60 overflow-hidden bg-gray-50">
                    <img
                      src={product.image || 'https://placehold.co/400?text=Chagee+Tea'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-gray-600 uppercase">
                      {category}
                    </div>
                  </div>

                  {/* Khu vực nội dung */}
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                      {product.name}
                    </h4>
                    
                    <p className="text-sm text-gray-500 mb-1 italic">
                      {product.name} {/* Hiển thị tên phụ/tên gốc */}
                    </p>
                    
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2 min-h-[32px]">
                      {product.descriptionU || "Trà sữa thượng hạng với hương vị đậm đà từ lá trà tươi."}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Giá từ</span>
                        <span className="text-red-600 font-extrabold text-xl">
                          {product.price?.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                      
                      {/* NÚT THÊM NHANH VÀO GIỎ HÀNG */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Quan trọng: Để không kích hoạt onProductClick của thẻ cha
                          onAddToCart({
                            ...product,
                            quantity: 1,
                            size: "M",
                            sugar: "100%",
                            ice: "Đá thường"
                          });
                        }}
                        className="w-11 h-11 bg-[#002B5B] text-white rounded-xl flex items-center justify-center hover:bg-blue-800 transition-all shadow-lg active:scale-90"
                        title="Thêm vào giỏ hàng"
                      >
                        <Plus size={24} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}