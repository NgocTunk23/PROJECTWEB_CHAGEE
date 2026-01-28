// import { useState } from 'react';
import { CartItem } from '../App';
import { ChevronLeft, Trash2, Plus, Minus, Tag } from 'lucide-react';

// Interface cho Voucher (Tạm thời để đây để không lỗi code cũ, dù chưa dùng)
export interface Voucher {
  id: string;
  code: string;
  description: string;
  value: number;
  minOrder: number;
}

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void; // Không cần tham số voucher nữa
  onClose: () => void;
}

export function CartPage({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout, 
  onClose 
}: CartPageProps) {
  
  // State tạm thời không dùng
  // const [showVoucherModal, setShowVoucherModal] = useState(false);
  // const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  // Tính tổng tiền (Không trừ giảm giá)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0; 
  const total = subtotal - discount;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 shadow-sm z-10">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl flex-1 font-bold text-gray-800">Giỏ hàng</h1>
        <span className="text-gray-500 font-medium">({cartItems.length} món)</span>
      </header>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto pb-40 bg-gray-50">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4 mt-[-60px]">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <p className="text-xl font-semibold text-gray-600 mb-2">Giỏ hàng trống</p>
            <p className="text-sm text-gray-500 mb-6">Hãy thêm vài món ngon vào đây nhé!</p>
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              Xem thực đơn
            </button>
          </div>
        ) : (
          <div className="px-4 py-6 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 line-clamp-1 text-lg">{item.name}</h3>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors absolute top-3 right-3"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        <p className="flex items-center gap-1">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{item.size}</span>
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{item.sugar}</span>
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{item.ice}</span>
                        </p>
                        {item.toppings && item.toppings.length > 0 && (
                           <p className="text-gray-500 line-clamp-1">+ {item.toppings.join(', ')}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <span className="text-red-600 font-bold text-lg">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                      
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md shadow-sm transition-all text-gray-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md shadow-sm transition-all text-gray-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Voucher Section (Tạm khóa) */}
            <div className="bg-gray-100 border border-dashed border-gray-300 rounded-xl p-4 opacity-70">
              <button
                disabled={true} 
                className="w-full flex items-center justify-between cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <Tag size={20} className="text-gray-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-700">Mã giảm giá</p>
                    <p className="text-xs text-gray-500">Chức năng đang bảo trì</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm font-medium">Chọn &rarr;</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Thanh toán */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 z-50 rounded-t-2xl">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              
              <div className="flex justify-between text-xl pt-3 border-t border-gray-100 font-bold items-end">
                <span className="text-gray-800">Tổng cộng</span>
                <span className="text-red-600 text-2xl">{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button
              onClick={() => onCheckout()}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
            >
              <span>Tiến hành đặt hàng</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}