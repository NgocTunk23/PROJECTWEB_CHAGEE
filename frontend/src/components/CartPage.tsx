import { useState, useEffect } from 'react'; 
import { CartItem } from '../App';
import { ChevronLeft, Trash2, Plus, Minus, Tag, X, Check, ShoppingBag } from 'lucide-react';
import { VoucherService } from '../services/voucherService';

export interface Voucher { 
  vouchercode: string;
  vouchername: string;
  discountamount: number;
  discountpercentage: number;
  minordervalue: number;
  expirydate: string;
  usage_left: number; // ✅ Thêm cột này để hiện số lần còn lại
}

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: (voucherId?: string) => void;
  onClose: () => void;
  currentUser: any;
  onApplyVoucher: (v: Voucher | null) => void;
}

export function CartPage({ 
  cartItems, onUpdateQuantity, onRemoveItem, onCheckout, onClose, currentUser, onApplyVoucher 
}: CartPageProps) {
  
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        if (!currentUser?.username || !currentUser?.token) return;
        const data = await VoucherService.getAvailableVouchers(currentUser.username, currentUser.token);
        setVouchers(data); 
      } catch (error) {
        console.error("Lỗi tải voucher:", error);
        setVouchers([]); 
      }
    };
    fetchVouchers();
  }, [currentUser?.username, currentUser?.token]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getVoucherDiscount = (v: Voucher | null) => {
    if (!v || subtotal < v.minordervalue) return 0;
    if (v.discountamount && v.discountamount > 0) return v.discountamount;
    if (v.discountpercentage && v.discountpercentage > 0) return (subtotal * v.discountpercentage) / 100;
    return 0;
  };

  const discount = getVoucherDiscount(appliedVoucher);
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col font-sans animate-in slide-in-from-right duration-300">
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 shrink-0 z-10">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={24} /></button>
        <h1 className="text-xl flex-1 font-bold text-gray-800">Giỏ hàng</h1>
        <span className="text-gray-500 font-medium">({cartItems.length} món)</span>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-50 pb-80">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
            <ShoppingBag size={64} className="mb-4" />
            <p className="text-xl font-bold italic">Chưa có món nào.</p>
          </div>
        ) : (
          <div className="px-4 py-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 border border-gray-50">
                {/* Sửa lại productimage để khớp interface */}
                <img src={item.product?.image || item.image} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                        {item.sizelevel} | {item.sugarlevel} | {item.icelevel} 
                      </p>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-red-600 font-black">{(item.price * item.quantity).toLocaleString()}đ</span>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1 border">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}><Minus size={14}/></button>
                      <span className="font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}><Plus size={14}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-6 z-50 rounded-t-[2.5rem] shadow-2xl">
          <div className="max-w-xl mx-auto space-y-4">
            <button onClick={() => setShowVoucherModal(true)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 ${appliedVoucher ? 'border-red-500 bg-red-50' : 'border-dashed border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <Tag size={20} className={appliedVoucher ? 'text-red-600' : 'text-gray-400'} />
                <div className="text-left">
                  <p className="text-sm font-black">{appliedVoucher ? appliedVoucher.vouchername : 'Chọn mã giảm giá'}</p>
                  {appliedVoucher && discount > 0 && <p className="text-[10px] text-red-600 font-bold uppercase">Tiết kiệm -{discount.toLocaleString()}đ</p>}
                </div>
              </div>
              <span className="text-red-600 text-[10px] font-black">{appliedVoucher ? 'Thay đổi' : 'Xem ưu đãi →'}</span>
            </button>
            <div className="flex justify-between items-end border-t pt-2">
              <span className="font-bold text-gray-800">Tổng thanh toán</span>
              <span className="text-2xl font-black text-red-600">{total.toLocaleString()}đ</span>
            </div>
            <button onClick={() => onCheckout(appliedVoucher?.vouchercode)} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg">Đặt hàng ngay</button>
          </div>
        </div>
      )}

      {/* ✅ MODAL VOUCHER - ĐÃ FIX SCROLL & SPACER */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center sm:items-center justify-center p-0 sm:p-4 backdrop-blur-md">
          {/* Container chính: Thêm flex-col và max-h để nội dung bên trong tự scroll */}
          <div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[80vh]">
            
            {/* Header Modal - Cố định (Sticky) */}
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-gray-800 uppercase">Voucher của bạn</h3>
                <p className="text-[10px] text-gray-400 font-bold mt-1">Dùng để nhận ưu đãi từ CHAGEE</p>
              </div>
              <button onClick={() => setShowVoucherModal(false)} className="p-3 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"><X size={20}/></button>
            </div>
            
            {/* THÂN MODAL - NƠI XỬ LÝ SCROLL ĐỘC LẬP */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 touch-pan-y bg-gray-50/30 scrollbar-hide">
              {vouchers.length === 0 ? (
                <div className="text-center py-20 text-gray-400 italic">Hết mã rồi ông Tôn ơi!</div>
              ) : (
                <>
                  {vouchers.map((v) => {
                    const isEligible = subtotal >= v.minordervalue;
                    const isSelected = appliedVoucher?.vouchercode === v.vouchercode;

                    return (
                      <div 
                        key={v.vouchercode} 
                        onClick={() => isEligible && (setAppliedVoucher(v), onApplyVoucher(v), setShowVoucherModal(false))}
                        className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected ? 'border-red-600 bg-red-50 shadow-md scale-[1.02]' : isEligible ? 'border-orange-100 bg-white hover:border-orange-300' : 'opacity-50 grayscale border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-black text-gray-800 uppercase">{v.vouchername}</h4>
                          {/* Hiện số lần còn lại */}
                          <span className="bg-orange-600 text-white text-[9px] px-2 py-1 rounded-full font-black">
                            CÒN {v.usage_left} LẦN
                          </span>
                        </div>
                        
                        <p className="text-2xl font-black text-orange-600 mb-4">
                          {v.discountpercentage && v.discountpercentage > 0 ? `-${v.discountpercentage}%` : v.discountamount ? `-${v.discountamount.toLocaleString()}đ` : "QUÀ TẶNG"}
                        </p>

                        <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Đơn từ: {v.minordervalue.toLocaleString()}đ</span>
                          {isSelected && <Check size={18} className="text-red-600" />}
                        </div>

                
                      </div>
                    );
                  })}

                  {/* ✅ KHOẢNG TRẮNG CUỐI THẦN THÁNH */}
                  <div className="h-20 w-full shrink-0"></div> 
                </>
              )}
            </div>

            {/* Footer Modal - Cố định (Sticky) */}
            <div className="p-6 bg-white border-t shrink-0">
            </div>
          </div>
        </div>
      )}
    </div>
  );
}