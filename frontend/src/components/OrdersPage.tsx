import { useState, useEffect } from 'react';
import { Order } from '../App';
import { Clock, MapPin, ChevronRight, ShoppingBag, CheckCircle2, XCircle, X, Store } from 'lucide-react';

interface OrdersPageProps {
  currentUser: any; 
  onOrderNow: () => void;
}

export function OrdersPage({ currentUser, onOrderNow }: OrdersPageProps) {
  // 1. State quản lý dữ liệu
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 2. Gọi API lấy đơn hàng khi vào trang
  useEffect(() => {
    const fetchOrders = async () => {
      // 1. Kiểm tra xem người dùng đã đăng nhập và có Token chưa
      if (!currentUser || !currentUser.token) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // 2. Thêm Header Authorization để fix lỗi 403 
        const response = await fetch(
          `http://localhost:8080/api/orders/user/${currentUser.username || 'member01'}`, 
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentUser.token}` // 🔑 Chìa khóa ở đây nè
            }
          }
        );
        
        if (response.ok) {

            const data = await response.json();
            console.log("🔥 Dữ liệu thô từ API:", data); // 👈 Thêm dòng này

          // 3. MAPPING dữ liệu
          const mappedOrders = data.map((o: any) => ({
  id: o.orderid,
  status: o.statusU || 'pending', // Sửa từ status sang statusU
  totalPrice: o.originalprice,
  orderTime: o.ordertime,
  customerName: o.buyerusername,
  customerPhone: o.phonenumber || "N/A",
  address: o.address || "Nhận tại cửa hàng",
  paymentMethod: o.paymentmethod || "Tiền mặt",

  // ✅ THÊM DÒNG NÀY: Lấy ghi chú từ Backend
  note: o.note || "",

  store: {
    // Nếu branchid bị null thì hiện tên mặc định để tránh để trống ô hồng
    name: o.branchid ? `Chi nhánh ${o.branchid}` : "Cửa hàng Chagee Flagship",
    address: o.address || "Địa chỉ đang cập nhật..."
  },
  
  items: (o.orderDetails || []).map((detail: any) => {
    // Lưu ý: detail.product chứa thông tin món
    const p = detail.product || {}; 
    
    return {
      product: {
        id: detail.productid,
        // ✅ Sửa ở đây: dùng productname (viết thường)
        name: p.productname || "Sản phẩm không tên", 
        // ✅ Sửa ở đây: dùng productimage
        image: p.productimage
      },
      quantity: detail.quantity,
      price: detail.price,
      // Xử lý ghi chú nếu có (ví dụ: "Size L | 50% Sugar")
      size: detail.note ? detail.note.split(' | ')[0] : 'M',
      sugar: detail.note ? detail.note.split(' | ')[1] : '100%',
      ice: detail.note ? detail.note.split(' | ')[2] : 'Bình thường'
    };
  })
}));
          setOrders(mappedOrders);
        } else if (response.status === 403) {
          console.error("❌ Lỗi 403: Token hết hạn hoặc không có quyền truy cập!");
        } else {
          console.error(`❌ Lỗi API: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ Lỗi fetch đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  // 3. Phân loại đơn hàng
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

      <div className="space-y-3">
         {order.items.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex gap-3">
               <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100"
               />
               <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                     {item.sizelevel} • {item.quantity} phần
                  </p>
               </div>
            </div>
         ))}
         {order.items.length > 2 && (
           <p className="text-xs text-gray-400 text-center">...và {order.items.length - 2} món khác</p>
         )}
      </div>

      <div className="pt-3 mt-3 border-t border-gray-50 flex gap-2">
         <button 
            onClick={() => setSelectedOrder(order)} 
            className="flex-1 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
         >
            Xem chi tiết <ChevronRight size={14}/>
         </button>
      </div>
    </div>
  );

  // Màn hình Loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 min-h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-600 mb-4"></div>
        <p className="text-gray-500 text-sm">Đang tải lịch sử đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full pb-20">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 border-b border-gray-100 text-center">
        <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Lịch sử đơn hàng</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-gray-500 text-sm mb-6 text-center">Có vẻ như bạn chưa đặt món nào. Hãy khám phá menu ngay!</p>
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
                <h2 className="text-lg font-bold text-gray-800">Đơn hàng hiện tại ({successOrders.length})</h2>
              </div>
              {successOrders.map(order => <OrderCard key={order.id} order={order} />)}
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

     {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          
          {/* Main Modal Card */}
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-200 shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Chi tiết đơn hàng</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              {/* Shop Info */}
              <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                <p className="font-bold text-red-800 flex items-center gap-2"><Store size={16} /> {selectedOrder.store?.name}</p>
              </div>

              {/* Order Metadata */}
              <div className="space-y-2 pb-4 border-b border-dashed">
                <div className="flex justify-between"><span className="text-gray-500">Mã đơn:</span><span className="font-medium text-gray-800">#{selectedOrder.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Thời gian:</span><span className="font-medium">{new Date(selectedOrder.orderTime).toLocaleString('vi-VN')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phương thức thanh toán:</span><span className="font-medium uppercase text-blue-600">{selectedOrder.paymentMethod}</span></div>
               <div className="flex justify-between items-start pt-2 border-t border-dashed border-gray-100 mt-2"><span className="text-gray-400 shrink-0">Ghi chú:</span><span className="font-medium text-gray-800 text-right italic">{selectedOrder.note && selectedOrder.note.trim() !== "" ? selectedOrder.note  : "Không có"}
    </span>
  </div>
              </div>

              {/* Item List */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 text-xs uppercase">Danh sách món</h4>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                    <img 
                      src={item.product.image || "https://img.freepik.com/free-vector/coffee-cup-logo-template_23-2148474401.jpg"} 
                      className="w-14 h-14 rounded-lg object-cover bg-gray-100" 
                      alt=""
                      onError={(e) => { (e.currentTarget.src = "https://img.freepik.com/free-vector/coffee-cup-logo-template_23-2148474401.jpg") }}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{item.product.name} <span className="text-red-600 ml-1">x{item.quantity}</span></p>
                      <p className="text-[11px] text-gray-400 italic">{item.sizelevel} | {item.sugarlevel} | {item.icelevel}</p>
                      <div className="flex justify-between items-center mt-1">
                         <span className="text-xs text-gray-400">Giá: {item.price.toLocaleString()}đ</span>
                         <span className="font-semibold text-gray-800">{(item.price * item.quantity).toLocaleString()}đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-600">Tổng thanh toán</span>
                <span className="text-xl font-black text-red-600">{selectedOrder.totalPrice.toLocaleString()}đ</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl active:scale-95 transition-transform uppercase"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}