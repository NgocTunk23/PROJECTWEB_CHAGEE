import { useState } from 'react';
import { CartItem } from '../App';
import { vouchers, calculateVoucherDiscount, Voucher } from '../data/vouchers';
import { ChevronLeft, Trash2, Plus, Minus, Tag, X } from 'lucide-react';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: (appliedVoucher: Voucher | null) => void;
  onClose: () => void;
}

export function CartPage({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout, onClose }: CartPageProps) {
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  // Tính tổng tiền
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedVoucher ? calculateVoucherDiscount(appliedVoucher, subtotal) : 0;
  const total = subtotal - discount;

  const handleApplyVoucher = (voucher: Voucher) => {
    if (subtotal >= voucher.min_order_value) {
      setAppliedVoucher(voucher);
      setShowVoucherModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl flex-1">Giỏ hàng</h1>
        <span className="text-gray-500">({cartItems.length} món)</span>
      </header>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto pb-32">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🛒</span>
            </div>
            <p className="text-lg mb-2">Giỏ hàng trống</p>
            <p className="text-sm text-center">Thêm món yêu thích vào giỏ hàng nhé!</p>
          </div>
        ) : (
          <div className="px-4 py-6 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="mb-1">{item.name}</h3>
                        <div className="space-y-0.5 text-xs text-gray-500">
                          {item.size && <p>Size: {item.size}</p>}
                          {item.sugar && <p>Đường: {item.sugar}</p>}
                          {item.ice && <p>Đá: {item.ice}</p>}
                          {item.toppings && item.toppings.length > 0 && (
                            <p>Topping: {item.toppings.join(', ')}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-red-600">
                        ₫ {(item.price * item.quantity).toLocaleString('vi-VN')}
                      </span>
                      
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-full"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-full"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Voucher Section */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <button
                onClick={() => setShowVoucherModal(true)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Tag size={20} className="text-orange-600" />
                  <div className="text-left">
                    {appliedVoucher ? (
                      <>
                        <p className="text-sm text-orange-900">{appliedVoucher.voucher_name}</p>
                        <p className="text-xs text-orange-700">
                          Giảm ₫ {discount.toLocaleString('vi-VN')}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-orange-900">Chọn mã giảm giá</p>
                    )}
                  </div>
                </div>
                {appliedVoucher ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAppliedVoucher(null);
                    }}
                    className="p-1 hover:bg-orange-200 rounded-full"
                  >
                    <X size={18} className="text-orange-700" />
                  </button>
                ) : (
                  <span className="text-orange-600 text-sm">Chọn →</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Summary */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>₫ {subtotal.toLocaleString('vi-VN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Giảm giá</span>
                  <span>- ₫ {discount.toLocaleString('vi-VN')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
                <span>Tổng cộng</span>
                <span className="text-red-600">₫ {total.toLocaleString('vi-VN')}</span>
              </div>
            </div>

            <button
              onClick={() => onCheckout(appliedVoucher)}
              className="w-full bg-red-600 text-white py-4 rounded-xl hover:bg-red-700 transition-colors"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center">
          <div className="bg-white w-full md:max-w-lg md:rounded-xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg">Chọn mã giảm giá</h2>
              <button
                onClick={() => setShowVoucherModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {vouchers.map(voucher => {
                const canApply = subtotal >= voucher.min_order_value;
                const discountValue = calculateVoucherDiscount(voucher, subtotal);

                return (
                  <button
                    key={voucher.voucher_code}
                    onClick={() => canApply && handleApplyVoucher(voucher)}
                    disabled={!canApply}
                    className={`w-full text-left border rounded-xl p-4 transition-all ${
                      canApply
                        ? 'border-orange-300 bg-orange-50 hover:bg-orange-100 cursor-pointer'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    } ${appliedVoucher?.voucher_code === voucher.voucher_code ? 'ring-2 ring-orange-500' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Tag size={18} className={canApply ? 'text-orange-600' : 'text-gray-400'} />
                        <span className="font-mono text-sm">{voucher.voucher_code}</span>
                      </div>
                      {canApply && discountValue > 0 && (
                        <span className="text-orange-600 text-sm">
                          - ₫ {discountValue.toLocaleString('vi-VN')}
                        </span>
                      )}
                    </div>
                    <p className="mb-1">{voucher.voucher_name}</p>
                    <p className="text-xs text-gray-600">
                      Đơn tối thiểu: ₫ {voucher.min_order_value.toLocaleString('vi-VN')}
                    </p>
                    {voucher.expiry_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        HSD: {new Date(voucher.expiry_date).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                    {!canApply && (
                      <p className="text-xs text-red-500 mt-1">
                        Thêm ₫ {(voucher.min_order_value - subtotal).toLocaleString('vi-VN')} để áp dụng
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
