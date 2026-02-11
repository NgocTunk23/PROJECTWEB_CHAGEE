import { useState, useEffect } from 'react';
import { Store } from '../App';
import { ChevronLeft, Search, MapPin, Clock } from 'lucide-react';
import { StoreService } from '../services/storeService';
import { calculateDistance, formatDistance } from '../utils/distance';

interface StoreSelectorProps {
  selectedStore: Store | null;
  onSelectStore: (store: Store) => void;
  onClose: () => void;
}

export function StoreSelector({ selectedStore, onSelectStore, onClose }: StoreSelectorProps) {
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
        // 1. Lấy vị trí User với độ chính xác cao và thời gian chờ (timeout)
        const userPos = await new Promise<{lat: number, lng: number} | null>((res) => {
          if (!navigator.geolocation) {
            res(null);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (p) => res({ lat: p.coords.latitude, lng: p.coords.longitude }),
            () => res(null),
            { 
              enableHighAccuracy: true, // Ưu tiên độ chính xác cao nhất (GPS thay vì IP)
              timeout: 5000,            // Chờ tối đa 5 giây để lấy tọa độ
              maximumAge: 0             // Không dùng vị trí cũ lưu trong bộ nhớ
            }
          );
        });

        // 2. Lấy dữ liệu từ API
        const data = await StoreService.getAllStores();
        
        // 3. Xử lý dữ liệu và tính toán khoảng cách thực tế
        const processed: Store[] = data.map((b: any) => {
          // ✅ KIỂM TRA TRƯỜNG DỮ LIỆU: Đảm bảo b.latitude và b.longitude có tồn tại
          // (Phòng trường hợp SQL trả về b.Latitude hoặc b.latitude viết thường)
          const storeLat = b.latitude || b.Latitude;
          const storeLng = b.longitude || b.Longitude;
          
          const hasCoords = userPos && storeLat && storeLng;
          
          // Nếu có đủ tọa độ mới tính, ngược lại để null
          const dist = hasCoords 
            ? calculateDistance(userPos.lat, userPos.lng, storeLat, storeLng) 
            : null;

          return {
            id: b.branchid,
            name: b.branchName || `CHAGEE ${b.branchid}`,
            address: b.addressU,
            // ✅ HIỂN THỊ THÔNG MINH: Nếu chưa tính được thì hiện "Đang định vị..."
            distance: dist !== null ? formatDistance(dist) : "Đang xác định...",
            _distVal: dist ?? 999999, // Dùng để sắp xếp: không có khoảng cách thì đẩy xuống cuối
            isOpen: checkIsOpen(b.openTime, b.closeTime),
            prepTime: '15 Phút'
          };
        });

        // 4. Sắp xếp danh sách: Cửa hàng gần bạn nhất lên đầu
        const sortedStores = [...processed].sort((a, b) => (a._sortDistance as number) - (b._sortDistance as number));
        
        setStores(sortedStores);
      } catch (error) {
        console.error("Lỗi khi khởi tạo dữ liệu cửa hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  const filtered = stores.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.address.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="p-4 border-b flex items-center gap-3">
        <button onClick={onClose}><ChevronLeft size={24} /></button>
        <input 
          className="flex-1 bg-gray-100 p-2 rounded-lg" 
          placeholder="Tìm kiếm..." 
          onChange={e => setSearchQuery(e.target.value)}
        />
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-400">Đang định vị...</p>
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