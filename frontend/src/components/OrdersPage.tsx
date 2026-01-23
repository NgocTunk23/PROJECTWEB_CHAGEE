import { Order } from '../App';
import { useState } from 'react';

interface OrdersPageProps {
  orders: Order[];
  onOrderNow: () => void;
}

export function OrdersPage({ orders, onOrderNow }: OrdersPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'instore' | 'other'>('all');

  const tabs = [
    { id: 'all' as const, label: 'Tất cả' },
    { id: 'online' as const, label: 'Trực tuyến' },
    { id: 'instore' as const, label: 'Tại cửa hàng' },
    { id: 'other' as const, label: 'Khác' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl">LỊCH SỬ ĐẶT HÀNG</h1>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm relative ${
                activeTab === tab.id
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-32 h-32 mb-6 relative">
            <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
            <div className="absolute inset-4 border-4 border-gray-300 border-t-transparent rounded-full transform rotate-45"></div>
            <div className="absolute inset-8 bg-white rounded-full"></div>
          </div>
          <h2 className="text-xl mb-2">"KHÔNG CÓ ĐƠN HÀNG."</h2>
          <p className="text-gray-500 text-sm mb-8">Bạn chưa đặt mua bất cứ thứ gì.</p>
          <button
            onClick={onOrderNow}
            className="bg-blue-900 text-white px-32 py-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            ĐẶT HÀNG NGAY
          </button>
        </div>
      ) : (
        <div className="px-4 py-6 space-y-4 max-w-4xl mx-auto">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="text-sm text-gray-600">Đơn hàng #{order.id}</div>
                  <div className="text-xs text-gray-500">
                    {order.orderTime.toLocaleString('vi-VN')}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  order.status === 'completed' ? 'bg-green-100 text-green-700' :
                  order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {order.status === 'completed' ? 'Hoàn thành' :
                   order.status === 'ready' ? 'Sẵn sàng' :
                   order.status === 'preparing' ? 'Đang chuẩn bị' :
                   order.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{item.product.name}</div>
                      <div className="text-xs text-gray-500">x{item.quantity}</div>
                    </div>
                    <div className="text-sm text-red-600">
                      ₫{(item.product.price * item.quantity).toLocaleString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">Tổng cộng</div>
                <div className="text-lg text-red-600">
                  ₫{order.totalPrice.toLocaleString('vi-VN')}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg text-sm hover:bg-gray-200">
                  Xem chi tiết
                </button>
                {order.status === 'completed' && (
                  <button className="flex-1 bg-blue-900 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-800">
                    Đặt lại
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
