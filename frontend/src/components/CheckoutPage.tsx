import { useState } from 'react';
import { CartItem, Store } from '../App';
import { Voucher } from '../data/vouchers';
import { ChevronLeft, MapPin, User, Phone, CreditCard, Wallet } from 'lucide-react';

interface CheckoutPageProps {
  cartItems: CartItem[];
  selectedStore: Store | null;
  appliedVoucher: Voucher | null;
  subtotal: number;
  discount: number;
  total: number;
  onConfirmOrder: (orderData: OrderData) => void;
  onBack: () => void;
}

export interface OrderData {
  customerName: string;
  customerPhone: string;
  paymentMethod: 'COD' | 'VNPay' | 'MoMo' | 'ZaloPay';
  note?: string;
}

export function CheckoutPage({
  cartItems,
  selectedStore,
  appliedVoucher,
  subtotal,
  discount,
  total,
  onConfirmOrder,
  onBack
}: CheckoutPageProps) {
  const [formData, setFormData] = useState<OrderData>({
    customerName: '',
    customerPhone: '',
    paymentMethod: 'COD',
    note: ''
  });

  const [errors, setErrors] = useState<Partial<OrderData>>({});

  const validateForm = () => {
    const newErrors: Partial<OrderData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Vui lòng nhập tên';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onConfirmOrder(formData);
    }
  };

  const paymentMethods = [
    { id: 'COD', name: 'Tiền mặt', icon: Wallet, color: 'text-green-600' },
    { id: 'VNPay', name: 'VNPay', icon: CreditCard, color: 'text-blue-600' },
    { id: 'MoMo', name: 'MoMo', icon: Wallet, color: 'text-pink-600' },
    { id: 'ZaloPay', name: 'ZaloPay', icon: Wallet, color: 'text-blue-500' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl flex-1">Xác nhận đơn hàng</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* Store Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-red-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="mb-1">Cửa hàng lấy đồ</h3>
                <p className="text-sm text-gray-600">{selectedStore?.name}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedStore?.address}</p>
                <p className="text-xs text-orange-600 mt-1">
                  Thời gian chuẩn bị: {selectedStore?.prepTime}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="mb-4 flex items-center gap-2">
              <User size={20} className="text-red-600" />
              Thông tin người nhận
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Nhập họ và tên"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.customerPhone ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.customerPhone && (
                  <p className="text-xs text-red-500 mt-1">{errors.customerPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Ghi chú (tùy chọn)</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Ghi chú cho quán (nếu có)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-red-600" />
              Phương thức thanh toán
            </h3>

            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setFormData({ ...formData, paymentMethod: method.id as any })}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                      formData.paymentMethod === method.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={24} className={method.color} />
                    <span className="flex-1 text-left">{method.name}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.paymentMethod === method.id
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {formData.paymentMethod === method.id && (
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="mb-4">Chi tiết đơn hàng</h3>

            <div className="space-y-3 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span>₫ {(item.price * item.quantity).toLocaleString('vi-VN')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span>₫ {subtotal.toLocaleString('vi-VN')}</span>
              </div>

              {appliedVoucher && discount > 0 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Giảm giá ({appliedVoucher.voucher_code})</span>
                  <span>- ₫ {discount.toLocaleString('vi-VN')}</span>
                </div>
              )}

              <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
                <span>Tổng cộng</span>
                <span className="text-red-600">₫ {total.toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 text-white py-4 rounded-xl hover:bg-red-700 transition-colors"
        >
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
}
