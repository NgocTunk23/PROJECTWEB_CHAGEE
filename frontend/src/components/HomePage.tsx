// import { Store } from '../App';
// import { MapPin, Truck, Store as StoreIcon, ChevronRight, QrCode, Settings, Bell } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Store } from '../App';
import { MapPin, Truck, Store as StoreIcon, ChevronRight, QrCode, Settings, Bell } from 'lucide-react';
import { VoucherService } from '../services/voucherService';
// Định nghĩa Interface dựa trên Java Entity ông đã gửi
interface Voucher {
  vouchercode: string;        // Khớp với private String vouchercode
  vouchername: string;        // Khớp với private String vouchername
  discountamount: number;     // Khớp với private BigDecimal discountamount
  discountpercentage: number; // Khớp với private Integer discountpercentage
  minordervalue: number;      // Khớp với private BigDecimal minordervalue
  expirydate: string; // ✅ THÊM DÒNG NÀY (Nhận về dưới dạng String)
}

interface HomePageProps {
  selectedStore: Store | null;
  onSelectStore: () => void;
  onNavigateToMenu: () => void;
  // ✅ THÊM DÒNG NÀY
  currentUser: any; 
}

export function HomePage({
  selectedStore, 
  onSelectStore, 
  onNavigateToMenu, 
  currentUser // 👈 THÊM CHÍNH XÁC CHỮ NÀY VÀO ĐÂY
}: HomePageProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(true);
  const ranks = [
    { name: 'BRONZE', threshold: 100, color: 'bronze-metallic', textColor: 'text-amber-50', icon: '🥉' },
    { name: 'SILVER', threshold: 300, color: 'silver-metallic', textColor: 'text-gray-900', icon: '🥈' },
    { name: 'GOLD', threshold: 600, color: 'gold-metallic', textColor: 'text-yellow-950', icon: '🥇' },
    { name: 'DIAMOND', threshold: 1000, color: 'diamond-metallic', textColor: 'text-white', icon: '💎' }
  ];
  // --- LOGIC XỬ LÝ HẠNG THÀNH VIÊN (SANG TRỌNG) ---
  const getMembershipStatus = (points: number = 0) => {
    // Tìm hạng tiếp theo dựa trên số điểm hiện tại
    const nextRankIndex = ranks.findIndex(r => points < r.threshold);
    
    let currentRank, nextRank;

    if (nextRankIndex === -1) {
      // Đã đạt hạng Kim Cương (hạng cuối)
      currentRank = ranks[ranks.length - 1];
      nextRank = null;
    } else {
      // Đang ở các hạng từ Đồng đến Lục Bảo
      currentRank = nextRankIndex > 0 ? ranks[nextRankIndex - 1] : ranks[0];
      nextRank = ranks[nextRankIndex];
    }

    // Tính toán số CUP và tiến độ an toàn
    const cupsNeeded = nextRank ? Math.ceil((nextRank.threshold - points) / 10) : 0;
    const prevThreshold = nextRankIndex > 0 ? ranks[nextRankIndex - 1].threshold : 0;
    const range = nextRank ? (nextRank.threshold - prevThreshold) : 1;
    const progress = nextRank ? ((points - prevThreshold) / range) * 100 : 100;

    return { 
      ...currentRank, 
      nextRankName: nextRank?.name || null, 
      cupsNeeded, 
      progress: Math.min(Math.max(progress, 0), 100) 
    };
  };

  // Trong HomePage.tsx
useEffect(() => {
  const fetchVouchers = async () => {
    try {
      setIsLoadingVouchers(true);
      let data = [];

      // ✅ LOGIC QUAN TRỌNG: Phân biệt đối xử
      if (currentUser?.username && currentUser?.token) {
        // Nếu là member01, chỉ lấy những mã họ CHƯA dùng (Kết quả sẽ là 3 hoặc 2 tùy người)
        data = await VoucherService.getAvailableVouchers(currentUser.username, currentUser.token);
        console.log(`[Cá nhân] Đã lấy mã cho ${currentUser.username}:`, data.length);
      } else {
        // Nếu là khách vãng lai, lấy tất cả mã đang có trên hệ thống
        data = await VoucherService.getVouchers('all', currentUser?.token);
        console.log("[Chung] Đã lấy tất cả mã hệ thống:", data.length);
      }
      
      setVouchers(data);
    } catch (error) {
      console.error("Lỗi fetch voucher:", error);
    } finally {
      setIsLoadingVouchers(false); // ✅ Nhớ tắt loading để giao diện cập nhật số lượng
    }
  };
  
  fetchVouchers();
}, [currentUser?.username, currentUser?.token]); // Chạy lại khi đổi User
  const status = getMembershipStatus(currentUser?.rewardpoints || 0);
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🍵</span>
            </div>
            <span className="text-xl tracking-wide">CHAGEE</span> 
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
            <h1 className="text-2xl text-gray-800 mb-2">Chào mừng trở lại, {(currentUser?.fullname || 'FRIEND').toUpperCase()} !</h1>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-600">TEA LEAVES</span>
                <span className="ml-2 text-xl">{currentUser?.rewardpoints || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">VOUCHER</span>
                <span className="ml-2 text-xl">{vouchers.length}</span>
              </div>
            </div>
          </div>
          <button className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <QrCode size={32} />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* BANNER THÀNH VIÊN SIÊU CẤP (METALLIC EDITION) */}
        <div className={`relative overflow-hidden rounded-3xl p-8 ${status.color} shadow-2xl border border-white/30`}>
          {/* Tia sáng quét ngang */}
          <div className="animate-shimmer" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className={`text-3xl font-black tracking-tighter uppercase leading-none ${status.textColor}`}>
                  {status.name} MEMBER
                </h2>
              </div>
            </div>
            
           <div className={`text-m mb-4 flex flex-col gap-3 ${status.textColor}`}>
            {status.threshold !== Infinity ? (
              <>
                {/* 2. Nội dung thông báo: Không gạch chân, không màu mè */}
                <p>
                  Cần tích lũy thêm <span className="font-bold text-red-600">{status.cupsNeeded} CUPs</span> để lên hạng {status.nextRankName}
                </p>
                
                {/* 3. Thanh tiến trình đơn giản */}
                <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all duration-1000"
                    style={{ width: `${status.progress}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="font-bold italic">Bạn đã đạt cấp bậc cao nhất! 💎</p>
            )}
          </div>
          
          {/* 4. Nút bấm Tiếng Việt */}
          <button className="text-sm text-gray-700 font-medium flex items-center gap-1">
            Xem Quyền lợi của tôi <ChevronRight size={16} />
          </button>
        </div>

          {/* Trang trí họa tiết chìm phía sau */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-32 h-32 bg-black/5 rounded-full blur-[40px] pointer-events-none" />
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
                <div className="text-3xl">{currentUser?.rewardpoints || 0}</div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-6 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                  VOUCHER
                  <span className="text-lg">🎫</span>
                </div>
                <div className="text-3xl">{vouchers.length}</div>
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

        {/* ✅ ĐÃ SỬA: Section Voucher cho người dùng mới */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">VOUCHER HIỆN CÓ</h3>
            <button 
              onClick={onNavigateToMenu}
              className="text-sm border border-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              DÙNG NGAY
            </button>
          </div>

          {isLoadingVouchers ? (
            <div className="flex gap-4 overflow-x-auto">
               <div className="w-full h-32 bg-gray-100 animate-pulse rounded-xl"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {vouchers.map((v) => (
                <div key={v.vouchercode} className="bg-[#FFF9F2] rounded-xl p-6 border-l-4 border-orange-400 shadow-sm relative overflow-hidden">
                  <h4 className="text-xl font-bold text-gray-800 uppercase leading-tight mb-2">
                    {v.vouchername}
                  </h4>
                  
                  {/* ✅ CHỈ HIỆN NẾU CÓ DỮ LIỆU GIẢM GIÁ */}
                  {(v.discountpercentage || v.discountamount) ? (
                    <div className="text-m font-medium text-orange-600 bg-orange-100 w-fit px-2 py-0.5 rounded">
                      {v.discountpercentage > 0 
                        ? `Giảm ${v.discountpercentage}%` 
                        : `Giảm ${(v.discountamount ?? 0).toLocaleString('vi-VN')}đ`
                      }
                    </div>
                  ) : (
                    /* Nếu không có giảm giá (Mua 2 Tặng 1), để một khoảng trống hoặc badge "Hot" */
                    <div className="h-8"></div> 
                  )}

                  <div className="text-[10px] text-gray-400 mt-2">
                    Hạn dùng: {v.expirydate ? new Date(v.expirydate).toLocaleDateString('vi-VN') : 'Vô thời hạn'}
                  </div>

                  {/* Trang trí hình bán nguyệt */}
                  <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white rounded-full -translate-y-1/2"></div>
                  <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white rounded-full -translate-y-1/2"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Promotional Banner */}
        {/* <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://via.placeholder.com/600x400"
            alt="Trà Sữa Oolong Đào"
            className="w-full h-auto"
          />
        </div> */}

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