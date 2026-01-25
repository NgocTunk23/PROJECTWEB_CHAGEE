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

export function MenuPage({ selectedStore, onSelectStore, onProductClick, onAddToCart, cartItems, onOpenCart }: MenuPageProps) {
  // State quản lý dữ liệu API
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductAPI[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); 
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. Fetch dữ liệu ban đầu ---
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        const [catsData, prodsData] = await Promise.all([
          ProductService.getCategories(),
          ProductService.getProducts() 
        ]);
        setCategories(catsData);
        setProducts(prodsData);
        if (catsData.length > 0) setSelectedCategory(catsData[0]);
      } catch (error) {
        console.error("Lỗi kết nối Backend:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // --- 2. Lọc theo danh mục ---
  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    try {
      setIsLoading(true);
      const data = await ProductService.getProducts(category);
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
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full md:hidden"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl">LẤY HÀNG</h1>
            </div>
          </div>
        </div>

        <button
          onClick={onSelectStore}
          className="w-full px-4 py-3 flex items-center justify-between border-t border-gray-100 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2 text-left">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">🏪</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="">{selectedStore?.name || 'Chọn cửa hàng'}</span>
                <span className="text-xs text-gray-500">-m</span>
              </div>
              {selectedStore && (
                <div className="text-sm text-gray-600">
                  Chuẩn bị {selectedStore.prepTime}, thời gian ước tính {selectedStore.prepTime}
                </div>
              )}
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
        </button>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 border-r border-gray-100 h-[calc(100vh-180px)] sticky top-[180px] overflow-y-auto">
          <nav className="p-4 space-y-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </aside>

        {/* Product List */}
        <div className="flex-1 px-4 py-6 mt-16 lg:mt-0">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl mb-4">{selectedCategory || "Tất cả món"}</h2>
            
            {isLoading ? (
               <div className="flex justify-center items-center h-40">
                 <p className="text-gray-500">Đang tải dữ liệu từ Server...</p>
               </div>
            ) : (
              <div className="space-y-4">
                {products.length === 0 ? (
                    <p className="text-gray-500 text-center">Không tìm thấy món nào.</p>
                ) : (
                    products.map(product => {
                    const productUI = {
                        id: product.productId, // ID thật từ DB
                        name: product.productName,
                        description: product.description || "Hương vị tuyệt hảo",
                        price: product.displayPrice,
                        image: product.productImage || 'https://placehold.co/150?text=No+Image', 
                        category: product.category,
                        isBestseller: (product.soldQuantity || 0) > 100
                    };
                    
                    return (
                        <div
                        key={productUI.id}
                        className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onProductClick(productUI)}
                        >
                        <img
                            src={productUI.image}
                            alt={productUI.name}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'https://placehold.co/150?text=No+Image';
                            }}
                        />
                        
                        <div className="flex-1 min-w-0">
                            <h3 className="mb-1 font-semibold">{productUI.name}</h3>
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{productUI.description}</p>
                            <div className="flex items-center gap-2 mb-2">
                            {productUI.isBestseller && (
                                <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                ⭐ Bestseller
                                </span>
                            )}
                            </div>
                            <div className="flex items-center gap-2">
                            <span className="text-red-600 font-bold">
                                {productUI.price?.toLocaleString('vi-VN')} ₫
                            </span>
                            </div>
                        </div>
                        
                        {/* NÚT THÊM VÀO GIỎ (Đã cập nhật logic) */}
                        <button 
                          className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            
                            // 1. Kiểm tra đã chọn cửa hàng chưa
                            if (!selectedStore) {
                              onSelectStore();
                              return;
                            }

                            // 2. Tạo object chuẩn bị gửi API
                            // Lưu ý: ID ở đây là tạm thời, Backend sẽ sinh ID cart detail mới
                            const cartItem = {
                              id: `temp_${Date.now()}`, 
                              product: productUI,
                              name: productUI.name,
                              image: productUI.image,
                              price: productUI.price,
                              
                              // Mặc định cho nút thêm nhanh
                              size: "M",
                              sugar: "100%",
                              ice: "Bình thường",
                              toppings: [], 
                              quantity: 1,
                              store: selectedStore
                            };
                            
                            // 3. Gọi hàm từ App.tsx (sẽ trigger API call)
                            onAddToCart(cartItem);
                          }}
                        >
                            <Plus size={20} />
                        </button>
                        </div>
                    );
                    })
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {cartItems.length > 0 && (
        <button 
          onClick={onOpenCart}
          className="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 z-30"
        >
          <ShoppingBag size={24} />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full text-xs flex items-center justify-center">
            {cartItems.length}
          </span>
        </button>
      )}
    </div>
  );
}