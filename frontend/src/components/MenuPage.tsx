import { useState, useEffect } from 'react';
import { Store, CartItem } from '../App';
import { ChevronRight, ChevronLeft, Plus, ShoppingBag } from 'lucide-react';
import { ProductService, ProductAPI } from '../services/productService';

interface MenuPageProps {
  selectedStore: Store | null;
  onSelectStore: () => void;
  onProductClick: (product: any) => void;
  onAddToCart: (item: any) => void;
  cartItems: CartItem[];
  onOpenCart?: () => void;
}

const ALL_CATEGORY_LABEL = "Tất cả sản phẩm";

export function MenuPage({ selectedStore, onSelectStore, onProductClick, onAddToCart, cartItems, onOpenCart }: MenuPageProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductAPI[]>([]);
  // ✅ FIX 1: Khởi tạo mặc định để Sidebar "Tất cả sản phẩm" sáng ngay từ đầu
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY_LABEL); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        const [catsData, prodsData] = await Promise.all([
          ProductService.getCategories(),
          ProductService.getProducts() 
        ]);
        
        // ✅ FIX 2: Thêm "Tất cả sản phẩm" vào đầu danh sách
        setCategories([ALL_CATEGORY_LABEL, ...catsData]);
        setProducts(prodsData);
        setSelectedCategory(ALL_CATEGORY_LABEL);
      } catch (error) {
        console.error("Lỗi kết nối Backend:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    try {
      setIsLoading(true);
      // Logic Refresh: Nếu bấm lại "Tất cả" thì lấy lại toàn bộ
      const data = category === ALL_CATEGORY_LABEL 
        ? await ProductService.getProducts() 
        : await ProductService.getProducts(category);
      setProducts(data);
    } catch (error) {
      console.error("Lỗi lọc món:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-full md:hidden">
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">LẤY HÀNG</h1>
            </div>
          </div>
        </div>

        <button onClick={onSelectStore} className="w-full px-4 py-3 flex items-center justify-between border-t border-gray-100 hover:bg-gray-50">
          <div className="flex items-center gap-2 text-left">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">🏪</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold">{selectedStore?.name || 'Chọn cửa hàng'}</span>
                {selectedStore && <span className="text-xs text-gray-500">-{selectedStore.distance}</span>}
              </div>
              {!selectedStore && <p className="text-xs text-gray-400">Chưa có cửa hàng nào được chọn</p>}
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
        </button>
      </header>

      <div className="flex">
        {/* ✅ FIX 3: Điều chỉnh top-[120px] thay vì 180px để Sidebar không bị đẩy xuống quá sâu */}
        <aside className="hidden lg:block w-64 border-r border-gray-100 h-[calc(100vh-120px)] sticky top-[120px] overflow-y-auto bg-white">
          <nav className="p-4 space-y-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-red-50 text-red-600 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </aside>

        {/* ✅ FIX 4: Xóa mt-16 để tránh khoảng trắng trống ở đầu danh sách sản phẩm */}
        <div className="flex-1 px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight">
                {selectedCategory}
            </h2>
            
            <div className="space-y-4">
              {isLoading ? (
                 <p className="text-center text-gray-400 py-10">Đang tải menu...</p>
              ) : products.map(product => {
                // ✅ FIX 5: Mapping chính xác descriptionU (từ database) và description (từ API)
                const productUI = {
                  id: product.productid,
                  name: product.productname,
                  // Thử lấy descriptionU trước, nếu không có thì lấy description
                  descriptionU: product.descriptionU || product.description, 
                  price: product.displayprice,
                  image: product.productimage,
                  category: product.category,
                  isBestseller: (product.soldquantity || 0) > 100
                };
                
                return (
                  <div key={productUI.id} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md cursor-pointer transition-shadow" onClick={() => onProductClick(productUI)}>
                    <img
                      src={productUI.image || 'https://placehold.co/150?text=No+Image'}
                      alt={productUI.name}
                      className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 font-bold text-gray-800">{productUI.name}</h3>
                      {/* Hiển thị mô tả sản phẩm */}
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                        {productUI.descriptionU || "Chưa có mô tả cho sản phẩm này"}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-red-600 font-bold">
                          {productUI.price?.toLocaleString('vi-VN')} ₫
                        </span>
                        <button 
                          className="w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!selectedStore) { onSelectStore(); return; }
                            onAddToCart({
                              id: `temp_${Date.now()}`,
                              product: productUI,
                              name: productUI.name,
                              image: productUI.image,
                              price: productUI.price,
                              quantity: 1, size: "M", sugar: "100%", ice: "Đá thường",
                              store: selectedStore
                            });
                          }}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}