import { useState } from 'react';
import { Product, Store, CartItem } from '../App';
import { ChevronLeft, Plus, Minus } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  store: Store;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const sizeOptions = [
  { name: 'M', price: 0 },
  { name: 'L', price: 8000 }
];

const sugarLevels = ['0%', '30%', '50%', '70%', '100%'];
const iceLevels = ['Không đá', 'Ít đá', 'Đá bình thường', 'Nhiều đá'];
const toppingOptions = [
  { name: 'Trân châu trắng', price: 8000 },
  { name: 'Trân châu đen', price: 8000 },
  { name: 'Thạch phô mai', price: 10000 },
  { name: 'Pudding trứng', price: 10000 },
  { name: 'Kem cheese', price: 12000 }
];

export function ProductDetail({ product, store, onClose, onAddToCart }: ProductDetailProps) {
  const [size, setSize] = useState('M');
  const [sugar, setSugar] = useState('100%');
  const [ice, setIce] = useState('Đá bình thường');
  const [toppings, setToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const toggleTopping = (toppingName: string) => {
    setToppings(prev =>
      prev.includes(toppingName)
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const calculateTotal = () => {
    let total = product.price;
    
    const selectedSize = sizeOptions.find(s => s.name === size);
    if (selectedSize) total += selectedSize.price;
    
    toppings.forEach(toppingName => {
      const topping = toppingOptions.find(t => t.name === toppingName);
      if (topping) total += topping.price;
    });
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    const item: CartItem = {
      product,
      size,
      sugar,
      ice,
      toppings,
      quantity,
      store
    };
    onAddToCart(item);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg flex-1">Chi tiết sản phẩm</h1>
        </div>
      </header>

      {/* Product Image */}
      <div className="w-full aspect-square bg-gray-100">
        <img
          src={product.image || product.product_image || 'https://via.placeholder.com/400'}
          alt={product.name || product.product_name || ''}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info & Customization */}
      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto pb-32">
        {/* Product Header */}
        <div>
          <h2 className="text-xl mb-2">{product.name || product.product_name}</h2>
          {product.nameEn && <p className="text-sm text-gray-500 mb-2">{product.nameEn}</p>}
          {(product.description || product.descriptionU) && (
            <p className="text-sm text-gray-600 mb-3">{product.description || product.descriptionU}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl text-red-600">₫ {(product.price || product.display_price || 0).toLocaleString('vi-VN')}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₫ {product.originalPrice.toLocaleString('vi-VN')}
              </span>
            )}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <h3 className="mb-3 text-sm">Chọn size <span className="text-red-600">*</span></h3>
          <div className="grid grid-cols-2 gap-3">
            {sizeOptions.map(sizeOption => (
              <button
                key={sizeOption.name}
                onClick={() => setSize(sizeOption.name)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  size === sizeOption.name
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-lg">{sizeOption.name}</div>
                {sizeOption.price > 0 && (
                  <div className="text-sm text-gray-600">
                    +₫{sizeOption.price.toLocaleString('vi-VN')}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sugar Level */}
        <div>
          <h3 className="mb-3 text-sm">Mức độ ngọt <span className="text-red-600">*</span></h3>
          <div className="grid grid-cols-5 gap-2">
            {sugarLevels.map(level => (
              <button
                key={level}
                onClick={() => setSugar(level)}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  sugar === level
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Ice Level */}
        <div>
          <h3 className="mb-3 text-sm">Mức độ đá <span className="text-red-600">*</span></h3>
          <div className="grid grid-cols-2 gap-3">
            {iceLevels.map(level => (
              <button
                key={level}
                onClick={() => setIce(level)}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  ice === level
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Toppings */}
        <div>
          <h3 className="mb-3 text-sm">Thêm topping (tùy chọn)</h3>
          <div className="space-y-2">
            {toppingOptions.map(topping => (
              <button
                key={topping.name}
                onClick={() => toggleTopping(topping.name)}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                  toppings.includes(topping.name)
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>{topping.name}</span>
                <span className="text-red-600">+₫{topping.price.toLocaleString('vi-VN')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <h3 className="mb-3 text-sm">Ghi chú (tùy chọn)</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thêm ghi chú cho đơn hàng..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600 resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-900 text-white py-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-between px-6"
            >
              <span>Thêm vào giỏ</span>
              <span>₫{calculateTotal().toLocaleString('vi-VN')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}