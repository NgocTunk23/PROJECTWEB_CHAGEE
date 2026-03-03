import { useState, useEffect } from 'react';
import { CartItem, Store } from '../App';
import { 
  ChevronLeft, MapPin, User, CreditCard, Wallet, 
  Tag, Ticket, X, ChevronRight, Info, CheckCircle 
} from 'lucide-react';
import { VoucherService } from '../services/voucherService';
import { Check} from 'lucide-react';
export interface Voucher { 
  vouchercode: string;
  vouchername: string;
  discountamount: number;
  discountpercentage: number;
  minordervalue: number;
  expirydate: string;
  usage_left: number; // ✅ Thêm cột này để hiện số lần còn lại
}


interface CheckoutPageProps {
  cartItems: CartItem[];
  selectedStore: Store | null;
  appliedVoucher: Voucher | null; 
  subtotal: number;
  discount: number;
  total: number;
  onConfirmOrder: (orderData: OrderData) => void;
  onBack: () => void;
  currentUser: any;
  onApplyVoucher: (voucher: Voucher | null) => void;
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

  // ✅ FIX: Khởi tạo dữ liệu người dùng một cách an toàn
  const [formData, setFormData] = useState<OrderData>({
    customerName: currentUser?.fullname || currentUser?.username || '', 
    // Quét toàn bộ các key phone có thể có từ Backend
    customerPhone: currentUser?.phone || currentUser?.phonenumber || currentUser?.phoneNumber || currentUser?.phone_number || '', 
    paymentMethod: 'COD',
    note: ''
  });

  const [errors, setErrors] = useState<Partial<OrderData>>({});

  // ✅ ĐIỀN SẴN DỮ LIỆU KHI USER LOAD XONG (Phòng trường hợp prop currentUser về muộn)
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        customerName: currentUser.fullname || currentUser.username || prev.customerName,
        customerPhone: currentUser.phone || currentUser.phonenumber || currentUser.phoneNumber || currentUser.phone_number || prev.customerPhone
      }));
    }
  }, [currentUser]);

  // 2. Lấy danh sách Voucher khi vào trang
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        // Chỉ thực hiện khi có đủ thông tin người dùng
        if (!currentUser?.username || !currentUser?.token) return;

        // ✅ FIX LỖI 2554: Chuyển sang dùng getAvailableVouchers (nhận 2 tham số)
        // Hàm này sẽ lọc đúng những mã mà ông chưa dùng ở Database
        const data = await VoucherService.getAvailableVouchers(
          currentUser.username, 
          currentUser.token
        );

        // ✅ FIX LỖI 2339: Vì Service đã trả về mảng sạch
        // Ông gán trực tiếp luôn, không cần .vouchers hay .content nữa
        setVouchers(data); 

      } catch (error) {
        console.error("Lỗi fetch voucher tại Checkout:", error);
        setVouchers([]); 
      }
    };

    fetchVouchers();
  }, [currentUser?.username, currentUser?.token]); // Chạy lại khi user đổi tài khoản

  // 3. Logic lọc Voucher
  const applicableVouchers = vouchers.filter(v => subtotal >= (v.minordervalue ?? 0));

  const validateForm = () => {
    const newErrors: Partial<OrderData> = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Vui lòng nhập tên';
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9,10}$/.test(formData.customerPhone)) {
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
        <h1 className="text-xl font-bold flex-1 text-center pr-10 text-gray-800">Xác nhận đơn hàng</h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          
          {/* Store Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-lg"><MapPin size={20} className="text-red-600" /></div>
              <div className="flex-1">
                <h3 className="mb-1 font-bold text-gray-800">Cửa hàng</h3>
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
              <div className="space-y-1">
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Họ và tên *"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${errors.customerName ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors.customerName && <p className="text-[10px] text-red-500 ml-2">{errors.customerName}</p>}
              </div>

              <div className="space-y-1">
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="Số điện thoại *"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${errors.customerPhone ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors.customerPhone && <p className="text-[10px] text-red-500 ml-2">{errors.customerPhone}</p>}
              </div>
            </div>
          </div>

          {/* ✅ MỤC HIỂN THỊ VOUCHER PHONG CÁCH MODAL (ĐÃ CẬP NHẬT) */}
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
            {/* Header của mục Voucher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-gray-800 uppercase text-sm tracking-tight">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Tag size={20} className="text-orange-600" strokeWidth={3} />
                </div>
                Chagee Voucher
              </div>
              <button 
                onClick={() => setIsVoucherModalOpen(true)}
                className="text-orange-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 bg-orange-50 px-3 py-2 rounded-full hover:bg-orange-100 transition-all"
              >
                {appliedVoucher ? "Thay đổi" : "Chọn mã ưu đãi"} <ChevronRight size={14} strokeWidth={3} />
              </button>
            </div>

            {/* HIỂN THỊ THẺ VOUCHER KHI ĐÃ CHỌN (Y CHANG TRONG MODAL) */}
            {appliedVoucher ? (
              <div className="relative p-6 rounded-2xl border-2 border-red-600 bg-red-50 shadow-sm animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-black text-gray-800 uppercase leading-tight">
                    {appliedVoucher.vouchername}
                  </h4>
                  {/* Hiển thị số lần còn lại từ logic mới của ông */}
                  <span className="bg-orange-600 text-white text-[9px] px-2 py-1 rounded-full font-black shadow-sm">
                    CÒN {appliedVoucher.usage_left} LẦN
                  </span>
                </div>
                
                <p className="text-3xl font-black text-orange-600 mb-4 tracking-tighter">
                  {appliedVoucher.discountpercentage && appliedVoucher.discountpercentage > 0 
                    ? `-${appliedVoucher.discountpercentage}%` 
                    : appliedVoucher.discountamount 
                      ? `-${appliedVoucher.discountamount.toLocaleString()}đ` 
                      : "QUÀ TẶNG"}
                </p>

                <div className="pt-4 border-t border-dashed border-red-200 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Đơn từ: {appliedVoucher.minordervalue.toLocaleString()}đ
                  </span>
                  <Check size={20} className="text-red-600" strokeWidth={4} />
                </div>
              </div>
            ) : (
              /* Trạng thái chưa chọn mã */
              <div className="py-4 px-2 border-2 border-dashed border-gray-100 rounded-2xl text-center">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Chưa áp dụng mã giảm giá</p>
              </div>
            )}
          </div>
{/* 
            {appliedVoucher && (
              <div className="mt-4 relative p-4 bg-[#FFF9F2] border-l-4 border-orange-400 rounded-r-xl flex items-center justify-between animate-in slide-in-from-right-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-gray-800 font-black text-sm uppercase">
                    <Ticket size={14} className="text-orange-600" /> {appliedVoucher.vouchername}
                  </div>
                  <p className="text-[10px] text-orange-600 font-bold mt-1 uppercase">Mã: {appliedVoucher.vouchercode}</p>
                </div>
                <button onClick={() => onApplyVoucher(null)} className="p-2 text-gray-400 hover:text-red-500"><X size={18} /></button>
                <div className="absolute top-1/2 -left-2 w-3 h-3 bg-gray-50 rounded-full -translate-y-1/2"></div>
              </div>
            )}
          </div> */}

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
                  <span className="text-gray-600"><span className="font-bold text-red-600">x{item.quantity}</span> {item.name}</span>
                  <span className="font-medium">{(item.price * item.quantity).toLocaleString()}đ</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium">{subtotal.toLocaleString()}đ</span>
              </div>
              {appliedVoucher && discount > 0 && (
                <div className="flex justify-between text-sm text-red-600 font-bold">
                  <span>Giảm giá</span>
                  <span>-{discount.toLocaleString()}đ</span>
                </div>
              )}
              <div className="flex justify-between text-lg pt-2 border-t font-bold">
                <span className="text-gray-800">Tổng thanh toán</span>
                <span className="text-red-600 text-xl">{total.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Confirm */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 rounded-t-2xl z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="text-red-600 font-black text-xl">{total.toLocaleString()}đ</div>
          <button onClick={handleSubmit} className="px-10 bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-100 active:scale-95 transition-all">
            Đặt hàng
          </button>
        </div>
      </div>

     {/* ✅ MODAL DANH SÁCH VOUCHER (ĐÃ ĐỒNG BỘ GIAO DIỆN XỊN) */}
{isVoucherModalOpen && (
  <div className="fixed inset-0 bg-black/60 z-[100] flex items-center sm:items-center justify-center p-0 sm:p-4 backdrop-blur-md">
    {/* Container chính: Thêm flex-col và max-h để nội dung bên trong tự scroll */}
    <div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[80vh]">
      
      {/* Header Modal - Cố định (Sticky) */}
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 shrink-0">
        <div>
          <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Voucher của bạn</h3>
          <p className="text-[10px] text-gray-400 font-bold mt-1">Dùng để nhận ưu đãi từ CHAGEE</p>
        </div>
        <button 
          onClick={() => setIsVoucherModalOpen(false)} 
          className="p-3 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
        >
          <X size={20}/>
        </button>
      </div>
      
      {/* THÂN MODAL - NƠI XỬ LÝ SCROLL ĐỘC LẬP */}
      <div className="p-6 space-y-4 overflow-y-auto flex-1 touch-pan-y bg-gray-50/30 scrollbar-hide">
        {applicableVouchers.length === 0 ? (
          <div className="text-center py-20 text-gray-400 italic">Không có mã nào đủ điều kiện</div>
        ) : (
          <>
            {applicableVouchers.map((v) => {
              // Kiểm tra điều kiện đơn tối thiểu và trạng thái chọn
              const isEligible = subtotal >= v.minordervalue;
              const isSelected = appliedVoucher?.vouchercode === v.vouchercode;

              return (
                <div 
                  key={v.vouchercode} 
                  onClick={() => isEligible && (onApplyVoucher(v), setIsVoucherModalOpen(false))}
                  /* ✅ THẺ FULL CARD: Không lỗ đục, bo góc 2xl theo style Homepage */
                  className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-red-600 bg-red-50 shadow-md scale-[1.02]' 
                      : isEligible 
                        ? 'border-orange-100 bg-white hover:border-orange-300' 
                        : 'opacity-50 grayscale border-gray-200'
                  }`}
                >
                  {/* Phần tên Voucher và Badge số lần dùng */}
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-black text-gray-800 uppercase leading-tight">{v.vouchername}</h4>
                    <span className="bg-orange-600 text-white text-[9px] px-2 py-1 rounded-full font-black">
                      CÒN {v.usage_left || 0} LẦN
                    </span>
                  </div>
                  
                  {/* Phần số tiền giảm giá */}
                  <p className="text-2xl font-black text-orange-600 mb-4">
                    {v.discountpercentage && v.discountpercentage > 0 
                      ? `-${v.discountpercentage}%` 
                      : v.discountamount 
                        ? `-${(Number(v.discountamount) || 0).toLocaleString()}đ` 
                        : "QUÀ TẶNG"}
                  </p>

                  {/* Footer của thẻ Voucher */}
                  <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Đơn từ: {v.minordervalue.toLocaleString()}đ
                    </span>
                    {isSelected && <CheckCircle size={18} className="text-red-600" />}
                  </div>
                </div>
              );
            })}

            {/* ✅ KHOẢNG TRẮNG CUỐI THẦN THÁNH */}
            <div className="h-20 w-full shrink-0"></div> 
          </>
        )}
      </div>

      {/* Footer Modal - Nút đóng cố định bên dưới */}
      <div className="p-6 bg-white border-t shrink-0">
        <button 
          onClick={() => setIsVoucherModalOpen(false)} 
          className="w-full py-4 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] hover:text-gray-600 transition-colors"
        >
          Quay lại
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}