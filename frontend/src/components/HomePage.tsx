import { Store } from '../App';
import { MapPin, Truck, Store as StoreIcon, ChevronRight, QrCode, Settings, Bell } from 'lucide-react';

interface HomePageProps {
  userPoints: { teaLeaves: number; vouchers: number };
  selectedStore: Store | null;
  onSelectStore: () => void;
  onNavigateToMenu: () => void;
}

export function HomePage({ userPoints, selectedStore, onSelectStore, onNavigateToMenu }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
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

      {/* Greeting Banner - Desktop/Tablet */}
      <div className="hidden md:block bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-8 border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-800 mb-2">Chào mừng trở lại, Friend !</h1>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-600">TEA LEAVES</span>
                <span className="ml-2 text-xl">{userPoints.teaLeaves}</span>
              </div>
              <div>
                <span className="text-gray-600">VOUCHER</span>
                <span className="ml-2 text-xl">{userPoints.vouchers}</span>
              </div>
            </div>
          </div>
          <button className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <QrCode size={32} />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* CHA Seeker Banner */}
        <div className="bg-gradient-to-br from-green-200 via-green-100 to-yellow-100 rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl mb-2">CHA Seeker</h2>
            <p className="text-sm text-gray-700 mb-4">
              10 CUPs cần thu thập thêm để lên hạng CHA Explorer
            </p>
            <button className="text-sm text-gray-700 flex items-center gap-1 hover:gap-2 transition-all">
              Xem Quyền lợi của tôi
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="absolute right-4 top-4 w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
            <span className="text-4xl">👸</span>
          </div>
        </div>

        {/* Account Section */}
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

        {/* Order Type Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={onNavigateToMenu}
            className="bg-orange-50 rounded-2xl p-8 flex flex-col items-center gap-3 hover:bg-orange-100 transition-colors border-2 border-transparent hover:border-orange-300"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <StoreIcon size={32} className="text-gray-800" />
            </div>
            <span className="text-lg">PICKUP</span>
          </button>
          <div className="bg-orange-50 rounded-2xl p-8 flex flex-col items-center gap-3 relative opacity-60">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <Truck size={32} className="text-gray-800" />
            </div>
            <span className="text-lg">DELIVERY</span>
            <span className="absolute top-4 right-4 bg-orange-200 text-orange-800 text-xs px-3 py-1 rounded-full">
              Coming soon
            </span>
          </div>
        </div>

        {/* New Users Section */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="">ĐỐI VỚI NGƯỜI DÙNG MỚI</h3>
            <button className="text-sm border border-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-50">
              DÙNG NGAY
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-400">
              <div className="text-sm text-gray-600 mb-2">Giảm 50% Ly Thứ 1</div>
              <div className="text-2xl text-orange-600 mb-2">50% Giảm</div>
              <div className="text-xs text-gray-500">Hết Hạn 22/01/2026</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-400">
              <div className="text-sm text-gray-600 mb-2">Mua 2 Tặng 1</div>
              <div className="text-2xl text-orange-600 mb-2">FREE</div>
              <div className="text-xs text-gray-500">Hết Hạn 30/01/2026</div>
            </div>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://via.placeholder.com/600x400"
            alt="Trà Sữa Oolong Đào"
            className="w-full h-auto"
          />
        </div>

        {/* Feature Cards - Desktop/Tablet */}
        <div className="hidden md:grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 text-white flex flex-col items-center justify-center gap-3">
            <div className="text-5xl">🌿</div>
            <h4 className="text-xl">Lịch Sử CHAGEE</h4>
          </div>
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 text-white flex flex-col items-center justify-center gap-3">
            <div className="text-5xl">👥</div>
            <h4 className="text-xl">Giới Thiệu Bạn Mới</h4>
          </div>
        </div>

        {/* FAQs */}
        <button className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="text-gray-800">Những câu hỏi thường gặp</span>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}