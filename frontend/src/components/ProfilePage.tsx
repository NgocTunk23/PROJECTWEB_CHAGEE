import { Order } from '../App';
import { Settings, Bell, ChevronRight, QrCode, Gift, Users, HelpCircle, LogOut, User } from 'lucide-react';

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
            <span className="text-xl tracking-wide font-bold text-gray-800">CHAGEE</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-xs">🇻🇳</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Settings size={20} className="text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full relative transition-colors">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border border-white"></span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-red-600 to-orange-500 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              {currentUser ? (
                <>
                  <h2 className="text-xl font-bold mb-1">{currentUser.full_name || currentUser.username}</h2>
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium border border-white/20">
                    {currentUser.membership_tier || 'Thành viên mới'}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-1">Khách hàng</h2>
                  <button 
                    onClick={onOpenLogin}
                    className="text-sm text-white/90 underline hover:text-white transition-colors"
                  >
                    Đăng nhập để nhận ưu đãi
                  </button>
                </>
              )}
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Points Section */}
        <div>
          <h3 className="mb-4 font-bold text-gray-800 text-sm tracking-wider">TÀI KHOẢN CỦA TÔI</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white border border-orange-100 rounded-xl p-6 flex items-center justify-between shadow-sm">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1 uppercase tracking-wider">
                  Tea Leaves
                  <span className="text-lg">🍂</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{userPoints.teaLeaves}</div>
              </div>
            </div>
            
            {/* ❌ ĐÃ ẨN PHẦN VOUCHER */}
            {/* <div className="bg-white border border-orange-100 rounded-xl p-6 flex items-center justify-between shadow-sm">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1 uppercase tracking-wider">
                  Voucher
                  <span className="text-lg">🎫</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{userPoints.vouchers}</div>
              </div>
            </div> 
            */}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <QrCode size={20} className="text-gray-700" />
              </div>
              <span className="font-medium text-gray-700">Mã QR thành viên</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <div className="h-px bg-gray-100 mx-4"></div>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Gift size={20} className="text-gray-700" />
              </div>
              <span className="font-medium text-gray-700">Ưu đãi của tôi</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <div className="h-px bg-gray-100 mx-4"></div>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Users size={20} className="text-gray-700" />
              </div>
              <span className="font-medium text-gray-700">Giới thiệu bạn bè</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-sm tracking-wider">ĐƠN HÀNG GẦN ĐÂY</h3>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-500">#{order.id}</div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status === 'completed' ? 'Hoàn thành' :
                       order.status === 'ready' ? 'Sẵn sàng' : 
                       order.status === 'cancelled' ? 'Đã hủy' : 'Đang chuẩn bị'}
                    </div>
                  </div>
                  <div className="flex gap-4">
                     {/* Nếu có ảnh sản phẩm đầu tiên thì hiện */}
                     {order.items[0]?.product?.image && (
                        <img src={order.items[0].product.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                     )}
                     <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">{order.items[0]?.name}</div>
                        {order.items.length > 1 && (
                            <div className="text-xs text-gray-500">+{order.items.length - 1} món khác</div>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                            <div className="text-xs text-gray-400">
                            {new Date(order.orderTime).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="text-sm font-bold text-red-600">
                            {order.totalPrice.toLocaleString('vi-VN')}đ
                            </div>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Settings size={20} className="text-gray-700" />
              </div>
              <span className="font-medium text-gray-700">Cài đặt</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <div className="h-px bg-gray-100 mx-4"></div>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <HelpCircle size={20} className="text-gray-700" />
              </div>
              <span className="font-medium text-gray-700">Trợ giúp & Hỗ trợ</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <div className="h-px bg-gray-100 mx-4"></div>
          <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-lg transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <LogOut size={20} className="text-red-600" />
              </div>
              <span className="font-medium text-red-600">Đăng xuất</span>
            </div>
            <ChevronRight size={20} className="text-red-400" />
          </button>
        </div>

        {/* Version Info */}
        <div className="text-center text-xs text-gray-400 py-4 pb-20 md:pb-4">
          Phiên bản 2.1.0
        </div>
      </div>
    </div>
  );
}