import { useState, useEffect } from 'react';
import { Store } from '../App';
import { ChevronLeft, MapPin } from 'lucide-react';
import { StoreService } from '../services/storeService';
import { calculateDistance, formatDistance } from '../utils/distance';

interface StoreSelectorProps {
  selectedStore: Store | null;
  onSelectStore: (store: Store) => void;
  onClose: () => void;
  // ✅ NHẬN USER LOCATION TỪ APP.TSX
  userLocation: {lat: number, lng: number} | null;
}

export function StoreSelector({ selectedStore, onSelectStore, onClose, userLocation }: StoreSelectorProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const checkIsOpen = (open?: string, close?: string) => {
    if (!open || !close) return true;
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    const [oH, oM] = open.split(':').map(Number);
    const [cH, cM] = close.split(':').map(Number);
    return current >= (oH * 60 + oM) && current < (cH * 60 + cM);
  };
useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      
      try {
        // 1. Lấy dữ liệu từ API (Chỉ gọi 1 lần duy nhất ở đây)
        const data = await StoreService.getAllStores();
        
        // 🔍 SIÊU DEBUG: Ông mở F12, xem cái bảng này để biết Backend gửi cột gì về
        console.table(data); 

        // 2. Xử lý dữ liệu
        const processed: Store[] = data.map((b: any) => {
          const storeLat = b.latitude || b.Latitude;
          const storeLng = b.longitude || b.Longitude;
          
          const hasCoords = userLocation && storeLat && storeLng;
          
          const dist = hasCoords 
            ? calculateDistance(userLocation.lat, userLocation.lng, storeLat, storeLng) 
            : null;

          return {
            id: b.branchid.toString(),
            name: b.branchName || b.name || `CHAGEE ${b.branchid}`,
            
            // ✅ Lấy đúng addressU mà mình vừa ép Java gửi về
            address: b.addressU || b.address || "Địa chỉ chưa cập nhật",
            
            distance: dist !== null ? formatDistance(dist) : "Đang xác định...",
            _sortDistance: dist ?? 999999,
            isOpen: checkIsOpen(b.openTime, b.closeTime),
            prepTime: '15 Phút'
          };
        });

        // 3. Sắp xếp theo khoảng cách
        const sortedStores = [...processed].sort((a, b) => (a._sortDistance || 0) - (b._sortDistance || 0));
        
        setStores(sortedStores);
      } catch (error) {
        console.error("❌ Lỗi khởi tạo Store:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, [userLocation]); // Chạy lại khi có vị trí mới

  const filtered = stores.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.address.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="p-4 border-b flex items-center gap-3">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={24} /></button>
        <input 
          className="flex-1 bg-gray-100 p-2 rounded-lg" 
          placeholder="Tìm kiếm..." 
          onChange={e => setSearchQuery(e.target.value)}
        />
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-400">Đang tải danh sách...</p>
        ) : filtered.map(store => (
          <div key={store.id} className="border p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg uppercase">{store.name}</h3>
                <p className={`text-sm ${store.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                   {store.isOpen ? 'Đang mở cửa' : 'Đã đóng cửa'} • {store.prepTime}
                </p>
                <div className="flex items-start gap-2 mt-2 text-gray-500 text-sm">
                  <MapPin size={14} className="mt-1" />
                  <span>{store.address} (Cách {store.distance})</span>
                </div>
              </div>
              <div className="text-2xl">🏪</div>
            </div>
            <button
              onClick={() => store.isOpen && onSelectStore(store)}
              disabled={!store.isOpen}
              className={`w-full mt-4 py-3 rounded-lg font-bold text-white transition-all ${
                !store.isOpen ? 'bg-gray-300' : 'bg-blue-900 active:scale-95'
              }`}
            >
              {store.isOpen ? 'ĐẶT HÀNG NGAY' : 'CỬA HÀNG ĐÓNG CỬA'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}