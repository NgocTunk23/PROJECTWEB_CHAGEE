import { useState } from 'react';
import { Product, CartItem, CustomizationOptions } from '../App';
import { X, Plus, Minus } from 'lucide-react';

interface ProductCustomizerProps {
  product: Product;
  options: CustomizationOptions;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export function ProductCustomizer({
  product,
  options,
  onClose,
  onAddToCart
}: ProductCustomizerProps) {
  // 1. Chỉ giữ lại Size, Đường, Đá, Số lượng
  const [size, setSize] = useState(options.size[0].name);
  const [sugar, setSugar] = useState('100%');
  const [ice, setIce] = useState('Đá bình thường');
  const [quantity, setQuantity] = useState(1);

  // (Đã xóa hàm toggleTopping)

  const calculatePrice = () => {
    let total = product.price;
    
    // Chỉ cộng tiền Size
    const sizeOption = options.size.find(s => s.name === size);
    if (sizeOption) total += sizeOption.price;
    
    // (Đã xóa đoạn cộng tiền Topping)
    
    return total;
  };

  const handleAddToCart = () => {
      const item: CartItem = {
        // 1. Thêm ID cho món trong giỏ (Dùng thời gian hiện tại để không bị trùng)
        id: `cart_${Date.now()}`, 

        product,
        name: product.name,
        image: product.image,
        price: calculatePrice(),
        
        size,
        sugar,
        ice,
        
        // 2. Thêm mảng rỗng cho toppings (để thỏa mãn TypeScript)
        toppings: [], 
        
        quantity,
        store: { id: "store_temp", name: "Cửa hàng", address: "", distance: "", prepTime: "" }
      };

      onAddToCart(item);
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full md:max-w-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10 p-4 flex items-center justify-between">
          <h3 className="text-xl text-gray-800 font-bold">Tùy chỉnh đồ uống</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b">
          <div className="flex gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="text-lg text-gray-800 mb-1 font-semibold">{product.name}</h4>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description || "Hương vị tuyệt hảo"}</p>
              <p className="text-red-600 font-bold text-lg">
                {product.price.toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-6 space-y-6">
          {/* Size */}
          <div>
            <label className="block text-gray-700 mb-3 font-medium">Chọn size</label>
            <div className="grid grid-cols-2 gap-3">
              {options.size.map(sizeOption => (
                <button
                  key={sizeOption.name}
                  onClick={() => setSize(sizeOption.name)}
                  className={`p-4 rounded-lg border-2 transition-all flex justify-between items-center ${
                    size === sizeOption.name
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-red-200'
                  }`}
                >
                  <span className="text-lg">{sizeOption.name}</span>
                  {sizeOption.price > 0 && (
                    <span className="text-sm font-semibold">
                      +{sizeOption.price.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sugar Level */}
          <div>
            <label className="block text-gray-700 mb-3 font-medium">Độ ngọt</label>
            <div className="grid grid-cols-5 gap-2">
              {options.sugar.map(sugarLevel => (
                <button
                  key={sugarLevel}
                  onClick={() => setSugar(sugarLevel)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    sugar === sugarLevel
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-red-200'
                  }`}
                >
                  {sugarLevel}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level */}
          <div>
            <label className="block text-gray-700 mb-3 font-medium">Lượng đá</label>
            <div className="grid grid-cols-2 gap-3">
              {options.ice.map(iceLevel => (
                <button
                  key={iceLevel}
                  onClick={() => setIce(iceLevel)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    ice === iceLevel
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-red-200'
                  }`}
                >
                  {iceLevel}
                </button>
              ))}
            </div>
          </div>

          {/* ❌ ĐÃ XÓA PHẦN CHỌN TOPPING Ở ĐÂY */}

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 mb-3 font-medium">Số lượng</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="text-xl min-w-[3rem] text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <button
            onClick={handleAddToCart}
            className="w-full bg-red-600 text-white py-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-between px-6 font-bold text-lg"
          >
            <span>Thêm vào giỏ hàng</span>
            <span>
              {(calculatePrice() * quantity).toLocaleString('vi-VN')}đ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}