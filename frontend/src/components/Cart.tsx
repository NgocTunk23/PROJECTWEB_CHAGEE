import { CartItem } from '../App';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  totalPrice: number;
}

export function Cart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice
}: CartProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white sticky top-0 z-10">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag size={24} />
          Giỏ hàng ({items.length})
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-600">Giỏ hàng trống</p>
            <p className="text-sm text-gray-400 mt-2">
              Hãy thêm món yêu thích của bạn!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image || item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="text-gray-800 font-semibold truncate pr-2">
                        {item.product.name}
                        </h4>
                        <button
                            onClick={() => onRemoveItem(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1 mb-3">
                      <p><span className="font-medium text-gray-600">Size:</span> {item.size}</p>
                      <p><span className="font-medium text-gray-600">Đường:</span> {item.sugar} • <span className="font-medium text-gray-600">Đá:</span> {item.ice}</p>
                      
                      {/* ❌ ĐÃ ẨN TOPPING */}
                      {/* {item.toppings && item.toppings.length > 0 && (
                        <p className="truncate text-gray-500">
                          + {item.toppings.join(', ')}
                        </p>
                      )} */}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button
                          onClick={() =>
                            onUpdateQuantity(index, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(index, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-red-600 font-bold">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t p-4 space-y-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between text-lg">
            <span className="text-gray-600">Tổng cộng:</span>
            <span className="text-red-600 font-bold text-xl">
              {totalPrice.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <div className="flex gap-3">
             <button
                onClick={onClose}
                className="flex-1 border-2 border-orange-500 text-orange-600 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors"
            >
                Thêm món
            </button>
            <button className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
                Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}