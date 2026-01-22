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
      <div className="border-b p-4 flex items-center justify-between">
        <h3 className="text-xl text-gray-800 flex items-center gap-2">
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
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Giỏ hàng trống</p>
            <p className="text-sm text-gray-400 mt-2">
              Hãy thêm món yêu thích của bạn!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.nameVi}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-800 mb-1 truncate">
                      {item.product.nameVi}
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Size: {item.size}</p>
                      <p>Đường: {item.sugar} | Đá: {item.ice}</p>
                      {item.toppings.length > 0 && (
                        <p className="truncate">
                          Topping: {item.toppings.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors h-fit"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(index, item.quantity - 1)
                      }
                      className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(index, item.quantity + 1)
                      }
                      className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-orange-600">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t p-4 space-y-4 bg-white">
          <div className="flex items-center justify-between text-lg">
            <span className="text-gray-700">Tổng cộng:</span>
            <span className="text-orange-600">
              {totalPrice.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <button className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition-colors">
            Thanh toán
          </button>
          <button
            onClick={onClose}
            className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Tiếp tục mua hàng
          </button>
        </div>
      )}
    </div>
  );
}
