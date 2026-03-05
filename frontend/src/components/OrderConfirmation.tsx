import React, { useEffect } from 'react';
import { CheckCircle, Home, CreditCard, MapPin, Clock } from 'lucide-react';
import { Store } from '../App';
import { OrderData } from './CheckoutPage';
import { Voucher } from './CartPage';

interface OrderConfirmationProps {
  orderId: string;
  orderData: OrderData;
  selectedStore: Store | null;
  total: number;
  onPayNow: () => void;
  onBackToHome: () => void;
  appliedVoucher?: Voucher | null; 
  note: string;
}

export function OrderConfirmation({
  orderId,
  orderData,
  selectedStore,
  total,
  onPayNow,
  onBackToHome,
  appliedVoucher,
  note
}: OrderConfirmationProps) {

  // 🔍 SIÊU DEBUG: Mở Console (F12) để soi xem "thằng nào" đang bị rỗng
  useEffect(() => {
    console.group("🚀 [DEBUG] ORDER CONFIRMATION DATA");
    console.log("Mã đơn hàng (orderId):", orderId);
    console.log("Tổng tiền (total):", total);
    console.log("Dữ liệu khách (orderData):", orderData);
    console.log("Cửa hàng (selectedStore):", selectedStore);
    console.log("Voucher:", appliedVoucher);
    console.groupEnd();

    if (!total || total === 0) {
      console.warn("⚠️ CẢNH BÁO: Biến 'total' đang bằng 0 hoặc undefined. Kiểm tra lại trang Checkout!");
    }
  }, [orderId, total, orderData, selectedStore, appliedVoucher]);

  const isOnlinePayment = orderData?.paymentMethod !== 'Tiền Mặt';

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      {/* Success Animation Area */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          
          {/* Success Icon Section */}
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-600">
              Mã đơn hàng: <span className="font-mono font-bold text-red-600">{orderId || "N/A"}</span>
            </p>
          </div>

          {/* Store & Prep Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                <Clock size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Đơn hàng đang chuẩn bị</h3>
                <p className="text-sm text-gray-600">
                  Thời gian dự kiến: <span className="text-orange-600 font-medium">{selectedStore?.prepTime || "15-20 phút"}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-red-500 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Điểm lấy hàng</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedStore?.name || "Chi nhánh Chagee"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedStore?.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">Thông tin người nhận</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Họ và tên</span>
                <span className="font-medium text-gray-800">{orderData?.customerName || "Khách hàng"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số điện thoại</span>
                <span className="font-medium text-gray-800">{orderData?.customerPhone || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hình thức thanh toán</span>
                <span className={`font-bold ${isOnlinePayment ? 'text-blue-600' : 'text-green-600'}`}>
                  {orderData?.paymentMethod || "Tiền Mặt"}
                </span>
              </div>

              <div className="flex justify-between items-start text-sm pt-2 border-t border-dashed border-gray-100">
                <span className="text-gray-400 shrink-0">Ghi chú</span>
                <span className="text-gray-800 text-right font-medium italic">
                  {orderData.note && orderData.note.trim() !== "" 
                    ? orderData.note:""}
                </span>
              </div>

              {appliedVoucher && (
                <div className="flex justify-between text-pink-600 font-medium pt-2 border-t border-dashed">
                  <span>Voucher áp dụng</span>
                  <span>-{appliedVoucher.vouchercode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary - FIX SỐ 0 TẠI ĐÂY */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 bg-gradient-to-br from-white to-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg">Tổng thanh toán</h3>
              <span className="text-2xl font-black text-red-600">
                {/* ✅ Gia cố: Đảm bảo không crash và ưu tiên lấy total truyền vào */}
                ₫ {(total || 0).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
             <div className="shrink-0 text-xl">💡</div>
             <p className="text-sm text-blue-900 leading-relaxed">
               <strong>Lưu ý quan trọng:</strong> Vui lòng chụp lại màn hình hoặc mang theo mã đơn hàng <strong>{orderId}</strong> khi đến quán để nhận trà sữa nhanh hơn nhé!
             </p>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {isOnlinePayment && (
            <button
              onClick={onPayNow}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-200"
            >
              <CreditCard size={20} />
              Thanh toán ngay qua Ví/Thẻ
            </button>
          )}
          
          <button
            onClick={onBackToHome}
            className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
              isOnlinePayment
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'
            }`}
          >
            <Home size={20} />
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}