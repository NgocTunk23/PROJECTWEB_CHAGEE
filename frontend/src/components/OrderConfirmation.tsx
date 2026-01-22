import { CheckCircle, Home, CreditCard, MapPin, Clock } from 'lucide-react';
import { Store } from '../App';
import { OrderData } from './CheckoutPage';

interface OrderConfirmationProps {
  orderId: string;
  orderData: OrderData;
  selectedStore: Store | null;
  total: number;
  onPayNow: () => void;
  onBackToHome: () => void;
}

export function OrderConfirmation({
  orderId,
  orderData,
  selectedStore,
  total,
  onPayNow,
  onBackToHome
}: OrderConfirmationProps) {
  const isOnlinePayment = orderData.paymentMethod !== 'COD';

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Success Animation */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Success Icon */}
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-2xl mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-600">Mã đơn hàng: <span className="font-mono text-red-600">{orderId}</span></p>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="mb-1">Đơn hàng đang được chuẩn bị</h3>
                <p className="text-sm text-gray-600">
                  Thời gian dự kiến: {selectedStore?.prepTime}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Lấy tại</p>
                  <p className="text-sm">{selectedStore?.name}</p>
                  <p className="text-xs text-gray-500">{selectedStore?.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="mb-4">Thông tin người nhận</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Họ tên</span>
                <span>{orderData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số điện thoại</span>
                <span>{orderData.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức thanh toán</span>
                <span className={isOnlinePayment ? 'text-blue-600' : 'text-green-600'}>
                  {orderData.paymentMethod}
                </span>
              </div>
              {orderData.note && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-600 mb-1">Ghi chú</p>
                  <p className="text-gray-800">{orderData.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="mb-4">Thông tin thanh toán</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền</span>
                <span className="text-red-600">₫ {total.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái</span>
                <span className={isOnlinePayment ? 'text-orange-600' : 'text-green-600'}>
                  {isOnlinePayment ? 'Chưa thanh toán' : 'Thanh toán khi nhận hàng'}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              💡 <strong>Lưu ý:</strong> Vui lòng mang theo mã đơn hàng khi đến lấy đồ. 
              Bạn có thể kiểm tra trạng thái đơn hàng tại mục "Đơn hàng".
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t border-gray-200 p-4 space-y-3">
        {isOnlinePayment && (
          <button
            onClick={onPayNow}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard size={20} />
            Thanh toán ngay
          </button>
        )}
        
        <button
          onClick={onBackToHome}
          className={`w-full py-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
            isOnlinePayment
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <Home size={20} />
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
