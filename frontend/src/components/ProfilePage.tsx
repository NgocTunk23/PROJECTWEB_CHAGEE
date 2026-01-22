import { Order } from '../App';
import { Settings, Bell, ChevronRight, QrCode, Gift, Users, HelpCircle, LogOut } from 'lucide-react';
import { User } from 'lucide-react';

interface ProfilePageProps {
  userPoints: { teaLeaves: number; vouchers: number };
  orders: Order[];
  onOpenLogin?: () => void;
  currentUser?: any;
}

export function ProfilePage({ userPoints, orders, onOpenLogin, currentUser }: ProfilePageProps) {
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🍵</span>
            </div>
            <span className="text-xl tracking-wide">FRIEND</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🇻🇳</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings size={20} className="text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-red-600 to-orange-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User size={32} />
            </div>
            <div className="flex-1">
              {currentUser ? (
                <>
                  <h2 className="text-xl mb-1">{currentUser.full_name || currentUser.username}</h2>
                  <p className="text-sm text-white/80">Hạng: {currentUser.membership_tier || 'Member'}</p>
                </>
              ) : (
                <>
                  <h2 className="text-xl mb-1">Khách hàng</h2>
                  <button 
                    onClick={onOpenLogin}
                    className="text-sm text-white/90 underline hover:text-white"
                  >
                    Đăng nhập để nhận ưu đãi
                  </button>
                </>
              )}
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Points Section */}
        <div>
          <h3 className="mb-4">TÀI KHOẢN CỦA TÔI</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-xl p-6 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                  TEA LEAVES
                  <span className="text-lg">🍂</span>
                </div>
                <div className="text-3xl">{userPoints.teaLeaves}</div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-6 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                  VOUCHER
                  <span className="text-lg">🎫</span>
                </div>
                <div className="text-3xl">{userPoints.vouchers}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-4 space-y-3">
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <QrCode size={24} className="text-gray-700" />
              <span>Mã QR của tôi</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Gift size={24} className="text-gray-700" />
              <span>Ưu đãi của tôi</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Users size={24} className="text-gray-700" />
              <span>Giới thiệu bạn bè</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3>ĐƠN HÀNG GẦN ĐÂY</h3>
              <button className="text-sm text-red-600 hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">#{order.id}</div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status === 'completed' ? 'Hoàn thành' :
                       order.status === 'ready' ? 'Sẵn sàng' : 'Đang chuẩn bị'}
                    </div>
                  </div>
                  <div className="text-sm mb-1">{order.items[0]?.product.name}</div>
                  {order.items.length > 1 && (
                    <div className="text-xs text-gray-500">+{order.items.length - 1} món khác</div>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {order.orderTime.toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-sm text-red-600">
                      ₫{order.totalPrice.toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-xl p-4 space-y-3">
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Settings size={24} className="text-gray-700" />
              <span>Cài đặt</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <HelpCircle size={24} className="text-gray-700" />
              <span>Trợ giúp & Hỗ trợ</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-red-600">
            <div className="flex items-center gap-3">
              <LogOut size={24} />
              <span>Đăng xuất</span>
            </div>
            <ChevronRight size={20} className="text-red-400" />
          </button>
        </div>

        {/* Version Info */}
        <div className="text-center text-xs text-gray-400 py-4">
          Version 2.1.0
        </div>
      </div>
    </div>
  );
}