import { useState } from 'react';
import { Product, Store, CartItem } from '../App';
import { products, getCategories } from '../data/products';
import { ChevronRight, ChevronLeft, Plus, ShoppingBag } from 'lucide-react';

interface MenuPageProps {
  selectedStore: Store | null;
  onSelectStore: () => void;
  onProductClick: (product: Product) => void;
  cartItems: CartItem[];
  onOpenCart?: () => void;
}

const categories = getCategories();

export function MenuPage({ selectedStore, onSelectStore, onProductClick, cartItems, onOpenCart }: MenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredProducts = products.filter(p => p.category === selectedCategory);

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

        {/* Store Selection */}
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

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 border-r border-gray-100 h-[calc(100vh-180px)] sticky top-[180px] overflow-y-auto">
          <nav className="p-4 space-y-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
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

        {/* Sidebar - Mobile */}
        <div className={`lg:hidden fixed left-0 top-0 bottom-0 w-48 bg-white border-r border-gray-100 z-40 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-gray-100">
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={20} />
            </button>
          </div>
          <nav className="p-2 space-y-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  selectedCategory === category
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Category Tabs */}
        <div className="lg:hidden fixed left-0 right-0 top-[120px] bg-white border-b border-gray-100 z-20 overflow-x-auto">
          <div className="flex gap-2 px-4 py-3 whitespace-nowrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 px-4 py-6 mt-16 lg:mt-0">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl mb-4">{selectedCategory}</h2>
            
            <div className="space-y-4">
              {filteredProducts.map(product => {
                // Map product data to unified format
                const productData = {
                  id: product.product_id,
                  name: product.product_name,
                  nameEn: '',
                  description: product.descriptionU,
                  price: product.display_price,
                  image: product.product_image || 'https://via.placeholder.com/400',
                  category: product.category,
                  isBestseller: product.sold_quantity > 100
                };
                
                return (
                  <div
                    key={product.product_id}
                    className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onProductClick(productData as any)}
                  >
                    <img
                      src={productData.image}
                      alt={productData.name}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1">{productData.name}</h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{productData.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        {productData.isBestseller && (
                          <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                            ⭐ Bestseller
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">₫ {productData.price.toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                    <button className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 flex-shrink-0">
                      <Plus size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Floating Cart Button */}
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