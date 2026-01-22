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
  const [size, setSize] = useState(options.size[0].name);
  const [sugar, setSugar] = useState('100%');
  const [ice, setIce] = useState('Đá bình thường');
  const [toppings, setToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const toggleTopping = (toppingName: string) => {
    setToppings(prev =>
      prev.includes(toppingName)
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const calculatePrice = () => {
    let total = product.price;
    
    const sizeOption = options.size.find(s => s.name === size);
    if (sizeOption) total += sizeOption.price;
    
    toppings.forEach(toppingName => {
      const topping = options.toppings.find(t => t.name === toppingName);
      if (topping) total += topping.price;
    });
    
    return total;
  };

  const handleAddToCart = () => {
    const item: CartItem = {
      product,
      size,
      sugar,
      ice,
      toppings,
      quantity,
      price: calculatePrice()
    };
    onAddToCart(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full md:max-w-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10 p-4 flex items-center justify-between">
          <h3 className="text-xl text-gray-800">Tùy chỉnh đồ uống</h3>
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
              alt={product.nameVi}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="text-lg text-gray-800 mb-1">{product.nameVi}</h4>
              <p className="text-sm text-gray-500 mb-2">{product.name}</p>
              <p className="text-orange-600">
                {product.price.toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-6 space-y-6">
          {/* Size */}
          <div>
            <label className="block text-gray-700 mb-3">Chọn size</label>
            <div className="grid grid-cols-2 gap-3">
              {options.size.map(sizeOption => (
                <button
                  key={sizeOption.name}
                  onClick={() => setSize(sizeOption.name)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    size === sizeOption.name
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-lg">{sizeOption.name}</div>
                  {sizeOption.price > 0 && (
                    <div className="text-sm text-gray-600">
                      +{sizeOption.price.toLocaleString('vi-VN')}đ
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sugar Level */}
          <div>
            <label className="block text-gray-700 mb-3">Mức độ ngọt</label>
            <div className="grid grid-cols-5 gap-2">
              {options.sugar.map(sugarLevel => (
                <button
                  key={sugarLevel}
                  onClick={() => setSugar(sugarLevel)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    sugar === sugarLevel
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {sugarLevel}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level */}
          <div>
            <label className="block text-gray-700 mb-3">Mức độ đá</label>
            <div className="grid grid-cols-2 gap-3">
              {options.ice.map(iceLevel => (
                <button
                  key={iceLevel}
                  onClick={() => setIce(iceLevel)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    ice === iceLevel
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {iceLevel}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings */}
          <div>
            <label className="block text-gray-700 mb-3">
              Thêm topping (tùy chọn)
            </label>
            <div className="space-y-2">
              {options.toppings.map(topping => (
                <button
                  key={topping.name}
                  onClick={() => toggleTopping(topping.name)}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                    toppings.includes(topping.name)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <span className="text-gray-800">{topping.name}</span>
                  <span className="text-orange-600">
                    +{topping.price.toLocaleString('vi-VN')}đ
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 mb-3">Số lượng</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="text-xl min-w-[3rem] text-center">{quantity}</span>
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
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-between px-6"
          >
            <span className="text-lg">Thêm vào giỏ hàng</span>
            <span className="text-lg">
              {(calculatePrice() * quantity).toLocaleString('vi-VN')}đ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
