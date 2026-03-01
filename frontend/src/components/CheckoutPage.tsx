import { useState, useEffect } from 'react';
import { CartItem, Store } from '../App';
import { 
  ChevronLeft, MapPin, User, CreditCard, Wallet, 
  Tag, Ticket, X, ChevronRight, Info 
} from 'lucide-react';
import { VoucherService } from '../services/voucherService';

// 1. Định nghĩa Interface cho Voucher
interface Voucher {
  vouchercode: string;
  vouchername: string;
  discountamount: number | null;
  discountpercentage: number | null;
  minordervalue: number;
  expirydate: string;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  selectedStore: Store | null;
  appliedVoucher: Voucher | null; // Nhận từ App.tsx
  subtotal: number;
  discount: number;
  total: number;
  onConfirmOrder: (orderData: OrderData) => void;
  onBack: () => void;
  currentUser: any;
  onApplyVoucher: (voucher: Voucher | null) => void; // Hàm để cập nhật voucher vào App.tsx
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
  onBack,
  currentUser,
  onApplyVoucher
}: CheckoutPageProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [formData, setFormData] = useState<OrderData>({
    customerName: currentUser?.fullname || currentUser?.username || '', 
    customerPhone: currentUser?.phonenumber || currentUser?.phone || '', 
    paymentMethod: 'COD',
    note: ''
  });

  const [errors, setErrors] = useState<Partial<OrderData>>({});

  // 2. Lấy danh sách Voucher khi vào trang
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        if (!currentUser?.token) return;
        const data = await VoucherService.getVouchers(undefined, currentUser.token);
        setVouchers(data);
      } catch (error) {
        console.error("Lỗi tải voucher:", error);
      }
    };
    fetchVouchers();
  }, [currentUser]);

  // 3. Logic lọc Voucher: Chỉ hiện mã có minordervalue <= subtotal
  const applicableVouchers = vouchers.filter(v => subtotal >= (v.minordervalue ?? 0));

  const validateForm = () => {
    const newErrors: Partial<OrderData> = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Vui lòng nhập tên';
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Số điện thoại không hợp lệ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) onConfirmOrder(formData);
  };

  const paymentMethods = [
    { id: 'COD', name: 'Tiền mặt', icon: Wallet, color: 'text-green-600' },
    { id: 'VNPay', name: 'VNPay', icon: CreditCard, color: 'text-blue-600' },
    { id: 'MoMo', name: 'MoMo', icon: Wallet, color: 'text-pink-600' },
    { id: 'ZaloPay', name: 'ZaloPay', icon: Wallet, color: 'text-blue-500' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 shadow-sm z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-10">Xác nhận đơn hàng</h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          
          {/* Store Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-lg"><MapPin size={20} className="text-red-600" /></div>
              <div className="flex-1">
                <h3 className="mb-1 font-bold text-gray-800">Cửa hàng lấy đồ</h3>
                <p className="text-sm text-gray-600 font-medium">{selectedStore?.name}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedStore?.address}</p>
              </div>
            </div>
          </div>

          {/* Customer Info Form */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800 border-b pb-2">
              <User size={20} className="text-red-600" /> Thông tin người nhận
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Họ và tên *"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${errors.customerName ? 'border-red-500' : 'border-gray-200'}`}
              />
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="Số điện thoại *"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${errors.customerPhone ? 'border-red-500' : 'border-gray-200'}`}
              />
            </div>
          </div>

          {/* ✅ MỤC CHỌN VOUCHER (ĐÃ HỒI SINH) */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <Tag size={20} className="text-red-600" />
                Chagee Voucher
              </div>
              <button 
                onClick={() => setIsVoucherModalOpen(true)}
                className="text-red-600 font-bold text-sm flex items-center"
              >
                {appliedVoucher ? "Thay đổi" : "Chọn mã ưu đãi"} <ChevronRight size={16} />
              </button>
            </div>
            {appliedVoucher && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-red-700 text-sm font-medium uppercase">
                  <Ticket size={16} /> {appliedVoucher.vouchername}
                </div>
                <button onClick={() => onApplyVoucher(null)} className="text-red-400 hover:text-red-600"><X size={18} /></button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800 border-b pb-2">
              <CreditCard size={20} className="text-red-600" /> Thanh toán
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id as any })}
                  className={`flex flex-col items-center gap-2 p-3 border-2 rounded-xl transition-all ${formData.paymentMethod === method.id ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                >
                  <method.icon size={24} className={method.color} />
                  <span className="text-xs font-medium text-gray-700">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="mb-4 font-bold text-gray-800 border-b pb-2">Chi tiết đơn hàng</h3>
            <div className="space-y-3 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 flex gap-1"><span className="font-bold text-red-600">x{item.quantity}</span> {item.name}</span>
                  <span className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium">₫ {subtotal.toLocaleString('vi-VN')}</span>
              </div>
              
              {/* Hiển thị số tiền giảm giá */}
              {appliedVoucher && discount > 0 && (
                <div className="flex justify-between text-sm text-red-600 font-bold">
                  <span>Giảm giá ({appliedVoucher.vouchercode})</span>
                  <span>- ₫ {discount.toLocaleString('vi-VN')}</span>
                </div>
              )}

              <div className="flex justify-between text-lg pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-800">Tổng cộng</span>
                <span className="text-red-600 font-bold text-xl">₫ {total.toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Confirm */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 rounded-t-2xl z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Tổng thanh toán</p>
            <p className="text-xl font-bold text-red-600">₫ {total.toLocaleString('vi-VN')}</p>
          </div>
          <button onClick={handleSubmit} className="px-10 bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200">
            Đặt hàng
          </button>
        </div>
      </div>

      {/* ✅ MODAL DANH SÁCH VOUCHER KHẢ DỤNG */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl flex flex-col max-h-[70vh] animate-in slide-in-from-bottom duration-300">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-800 uppercase tracking-tight">Voucher của bạn</h3>
              <button onClick={() => setIsVoucherModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X /></button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-4">
              {applicableVouchers.length > 0 ? applicableVouchers.map(v => (
                <div 
                  key={v.vouchercode}
                  onClick={() => { onApplyVoucher(v); setIsVoucherModalOpen(false); }}
                  className={`p-5 border-2 rounded-2xl cursor-pointer transition-all relative overflow-hidden group ${appliedVoucher?.vouchercode === v.vouchercode ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-red-200 bg-white'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-gray-800 uppercase leading-tight">{v.vouchername}</h4>
                    {appliedVoucher?.vouchercode === v.vouchercode && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">Đang chọn</span>}
                  </div>
                  
                  {/* Logic ẩn phần giảm giá nếu là Mua 2 tặng 1 (null) */}
                  {(v.discountpercentage || v.discountamount) ? (
                    <div className="text-sm font-bold text-red-600 mb-2">
                      {v.discountpercentage ? `Ưu đãi giảm ${v.discountpercentage}%` : `Ưu đãi giảm ${(v.discountamount ?? 0).toLocaleString()}đ`}
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-orange-500 mb-2 italic">Chương trình Mua 2 Tặng 1</div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-2 border-t border-dashed pt-2">
                    <Info size={12} /> Áp dụng đơn từ {(v.minordervalue ?? 0).toLocaleString()}đ • Hạn dùng {new Date(v.expirydate).toLocaleDateString('vi-VN')}
                  </div>

                  {/* Vết cắt trang trí */}
                  <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-gray-50 rounded-full -translate-y-1/2 border-r border-gray-200"></div>
                  <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-gray-50 rounded-full -translate-y-1/2 border-l border-gray-200"></div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <Ticket size={48} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-gray-400 text-sm">Hiện chưa có mã giảm giá nào đủ điều kiện áp dụng cho đơn hàng ₫{subtotal.toLocaleString()} này.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}