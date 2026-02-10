import { useState } from 'react';
import { Order } from '../App';
import { Clock, MapPin, ChevronRight, ShoppingBag, CheckCircle2, XCircle, X, Store } from 'lucide-react';

interface OrdersPageProps {
  orders: Order[];
  onOrderNow: () => void;
}

export function OrdersPage({ orders, onOrderNow }: OrdersPageProps) {
  
  // 1. State để lưu đơn hàng đang được xem chi tiết (Mặc định là null = không xem gì cả)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 2. Phân loại đơn hàng
  const successOrders = orders.filter(o => o.status !== 'cancelled');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  // Helper: Màu trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'preparing': return 'Đang chuẩn bị';
      case 'ready': return 'Sẵn sàng nhận';
      case 'completed': return 'Hoàn tất';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  // --- COMPONENT CON: CARD ĐƠN HÀNG ---
  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-50">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="font-bold text-gray-800">#{order.id.toString().slice(-6)}</span>
             <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
             </span>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
              <MapPin size={14} className="text-red-600" />
              <span>{order.store?.name}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Clock size={12} />
            {new Date(order.orderTime).toLocaleString('vi-VN')}
          </div>
        </div>
        <div className="text-right">
           <span className="block font-bold text-red-600 text-lg">
              {order.totalPrice.toLocaleString('vi-VN')}đ
           </span>
        </div>
      </div>

      {/* Body: Danh sách món (rút gọn) */}
      <div className="space-y-3">
         {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-3">
               <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100"
               />
               <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                     {item.size} • {item.sugar} • {item.ice}
                  </p>
                  <div className="flex justify-between mt-1">
                     <span className="text-xs text-gray-500">x{item.quantity}</span>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Footer: Nút bấm */}
      <div className="pt-3 mt-3 border-t border-gray-50 flex gap-2">
         {/* 👇 ĐÃ SỬA: Thêm onClick để mở Modal */}
         <button 
            onClick={() => setSelectedOrder(order)} 
            className="flex-1 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
         >
            Xem chi tiết <ChevronRight size={14}/>
         </button>
         
         {order.status === 'completed' && (
            <button className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm">
               Đặt lại
            </button>
         )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-full pb-20">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800 text-center">LỊCH SỬ ĐẶT HÀNG</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Chưa có đơn hàng nào</h2>
          <button 
            onClick={onOrderNow}
            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
          >
            Đặt hàng ngay
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-8">
          {successOrders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-green-600" size={20} />
                <h2 className="text-lg font-bold text-gray-800">Đơn hàng đã đặt ({successOrders.length})</h2>
              </div>
              <div>{successOrders.map(order => <OrderCard key={order.id} order={order} />)}</div>
            </div>
          )}

          {cancelledOrders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 pt-4 border-t border-gray-200">
                <XCircle className="text-red-500" size={20} />
                <h2 className="text-lg font-bold text-gray-800">Đơn hàng đã hủy ({cancelledOrders.length})</h2>
              </div>
              <div className="opacity-75"> 
                {cancelledOrders.map(order => <OrderCard key={order.id} order={order} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- 👇 MODAL CHI TIẾT ĐƠN HÀNG (POPUP) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Lớp phủ đen mờ */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)} // Bấm ra ngoài thì đóng
          />
          
          {/* Nội dung Modal */}
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
             
             {/* Modal Header */}
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                   <h3 className="font-bold text-lg text-gray-800">Chi tiết đơn hàng</h3>
                   <p className="text-xs text-gray-500">#{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white rounded-full text-gray-500 hover:bg-gray-100">
                   <X size={20} />
                </button>
             </div>

             {/* Modal Body (Cuộn được) */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Thông tin cửa hàng */}
                <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex gap-3">
                   <div className="bg-white p-2 rounded-lg h-fit">
                      <Store size={20} className="text-red-600"/>
                   </div>
                   <div>
                      <p className="font-bold text-gray-800">{selectedOrder.store?.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{selectedOrder.store?.address}</p>
                   </div>
                </div>

                {/* Thông tin khách hàng */}
                <div className="space-y-1 text-sm bg-gray-50 p-3 rounded-xl">
                   <p><span className="text-gray-500">Người nhận:</span> <span className="font-medium">{selectedOrder.customerName}</span></p>
                   <p><span className="text-gray-500">SĐT:</span> <span className="font-medium">{selectedOrder.customerPhone}</span></p>
                   <p><span className="text-gray-500">Thời gian:</span> <span className="font-medium">{new Date(selectedOrder.orderTime).toLocaleString('vi-VN')}</span></p>
                   <p><span className="text-gray-500">Thanh toán:</span> <span className="font-medium uppercase">{selectedOrder.paymentMethod}</span></p>
                   {selectedOrder.status === 'cancelled' && (
                      <p className="text-red-600 font-bold mt-2">Đơn hàng đã bị hủy</p>
                   )}
                </div>

                {/* Danh sách món chi tiết */}
                <div>
                   <h4 className="font-bold text-gray-800 mb-2 text-sm">Danh sách món</h4>
                   <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => (
                         <div key={idx} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                            <img src={item.product.image} className="w-14 h-14 rounded-lg object-cover bg-gray-100" alt=""/>
                            <div className="flex-1">
                               <p className="font-medium text-gray-800 text-sm">{item.product.name}</p>
                               <p className="text-xs text-gray-500 mt-0.5">
                                  {item.size} • {item.sugar} • {item.ice}
                               </p>
                               {item.toppings?.length > 0 && (
                                  <p className="text-xs text-gray-400">+ {item.toppings.join(', ')}</p>
                               )}
                               <div className="flex justify-between mt-1 text-sm">
                                  <span className="text-gray-500">x{item.quantity}</span>
                                  <span className="font-medium text-gray-800">{(item.price * item.quantity).toLocaleString()}đ</span>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Modal Footer */}
             <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-end mb-4">
                   <span className="text-gray-600">Tổng tiền</span>
                   <span className="text-2xl font-bold text-red-600">{selectedOrder.totalPrice.toLocaleString()}đ</span>
                </div>
                {selectedOrder.status === 'completed' ? (
                   <button className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200">
                      Đặt lại đơn này
                   </button>
                ) : (
                   <button onClick={() => setSelectedOrder(null)} className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50">
                      Đóng
                   </button>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}