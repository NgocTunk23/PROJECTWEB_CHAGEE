import { useState } from 'react';
import { CartItem, Store } from '../App';
// import { Voucher } from '../data/vouchers'; // Tạm ẩn
import { ChevronLeft, MapPin, User, CreditCard, Wallet } from 'lucide-react';

interface CheckoutPageProps {
  cartItems: CartItem[];
  selectedStore: Store | null;
  appliedVoucher: any | null; // Để any để tránh lỗi type voucher đã xóa
  subtotal: number;
  discount: number;
  total: number;
  onConfirmOrder: (orderData: OrderData) => void;
  onBack: () => void;
  currentUser: any;
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
  // appliedVoucher,
  subtotal,
  // discount,
  total,
  onConfirmOrder,
  onBack,
  // 👇 2. NHẬN PROP NÀY
  currentUser
}: CheckoutPageProps) {
  // 👇 THÊM DÒNG NÀY ĐỂ DEBUG
  console.log("Dữ liệu User nhận được:", currentUser);
  const [formData, setFormData] = useState<OrderData>({
    // Ưu tiên lấy fullname, nếu không có thì lấy username, không có nữa thì để rỗng
    customerName: currentUser?.fullname || currentUser?.username || '', 
    
    // Ưu tiên lấy phonenumber, nếu không có thì lấy phone
    customerPhone: currentUser?.phonenumber || currentUser?.phone || '', 
    
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
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 shadow-sm z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-10">Xác nhận đơn hàng</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* Store Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                 <MapPin size={20} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-bold text-gray-800">Cửa hàng lấy đồ</h3>
                <p className="text-sm text-gray-600 font-medium">{selectedStore?.name}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedStore?.address}</p>
                <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                  Thời gian chuẩn bị: {selectedStore?.prepTime || "15 phút"}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800 border-b pb-2">
              <User size={20} className="text-red-600" />
              Thông tin người nhận
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Nhập họ và tên"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all ${
                    errors.customerName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all ${
                    errors.customerPhone ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.customerPhone && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors.customerPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú (tùy chọn)</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Ghi chú cho quán (ví dụ: ít ngọt, nhiều đá...)"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white resize-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800 border-b pb-2">
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
                        ? 'border-red-500 bg-red-50 ring-1 ring-red-500'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={24} className={method.color} />
                    <span className="flex-1 text-left font-medium text-gray-700">{method.name}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        formData.paymentMethod === method.id
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {formData.paymentMethod === method.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="mb-4 font-bold text-gray-800 border-b pb-2">Chi tiết đơn hàng</h3>

            <div className="space-y-3 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm items-start">
                  <div className="flex gap-2">
                     <span className="font-bold text-red-600 w-6">x{item.quantity}</span>
                     <div className="flex flex-col">
                        <span className="text-gray-800 font-medium">{item.name}</span>
                        <span className="text-xs text-gray-500">{item.size} • {item.sugar} • {item.ice}</span>
                     </div>
                  </div>
                  <span className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium">₫ {subtotal.toLocaleString('vi-VN')}</span>
              </div>

              {/* ❌ ĐÃ ẨN PHẦN GIẢM GIÁ */}
              {/* {appliedVoucher && discount > 0 && (
                <div className="flex justify-between text-sm text-orange-600 font-medium">
                  <span>Giảm giá ({appliedVoucher.voucher_code})</span>
                  <span>- ₫ {discount.toLocaleString('vi-VN')}</span>
                </div>
              )} */}

              <div className="flex justify-between text-lg pt-2 border-t border-gray-100 items-end">
                <span className="font-bold text-gray-800">Tổng cộng</span>
                <span className="text-red-600 font-bold text-xl">₫ {total.toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 rounded-t-2xl z-20">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
            <div className="flex-1">
                <p className="text-sm text-gray-500">Tổng thanh toán</p>
                <p className="text-xl font-bold text-red-600">₫ {total.toLocaleString('vi-VN')}</p>
            </div>
            <button
            onClick={handleSubmit}
            className="px-8 bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
            Đặt hàng
            </button>
        </div>
      </div>
    </div>
  );
}