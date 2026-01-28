import { useState, useEffect } from 'react';
import { Store } from '../App';
import { ChevronLeft, Search, MapPin } from 'lucide-react';
import { StoreService, BranchAPI } from '../services/storeService';

interface StoreSelectorProps {
  selectedStore: Store | null;
  onSelectStore: (store: Store) => void;
  onClose: () => void;
}

export function StoreSelector({ selectedStore, onSelectStore, onClose }: StoreSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'nearby' | 'favorite'>('nearby');
  
  // State lưu danh sách cửa hàng từ API
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Gọi API lấy danh sách cửa hàng khi mở Component
  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      const branchesData = await StoreService.getAllStores();
      
      // 2. Map dữ liệu từ Backend (BranchAPI) sang Frontend (Store)
      const mappedStores: Store[] = branchesData.map((branch: BranchAPI) => ({
        id: branch.branchid,
        // Vì DB chỉ có ID, ta tạm lấy ID làm tên hoặc hardcode chữ "Chi nhánh"
        name: `CHAGEE ${branch.branchid}`, 
        address: branch.addressU,
        
        // Các dữ liệu giả lập (vì DB chưa có cột này)
        distance: '2.5km', // Tạm để mock, sau này có thể tính toán thật
        prepTime: '15 Phút',
        image: undefined // Để undefined để hiện icon mặc định
      }));

      setStores(mappedStores);
      setIsLoading(false);
    };

    fetchStores();
  }, []);

  // 3. Lọc danh sách theo ô tìm kiếm
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg flex-1">Chọn cửa hàng lấy hàng</h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tên đường, quận..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex-1 px-4 py-3 text-sm relative ${
              activeTab === 'nearby' ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            Cửa hàng gần bạn
            {activeTab === 'nearby' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('favorite')}
            className={`flex-1 px-4 py-3 text-sm relative ${
              activeTab === 'favorite' ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            Yêu thích
            {activeTab === 'favorite' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
            )}
          </button>
        </div>
      </header>

      {/* Store List */}
      <div className="px-4 py-6 space-y-4 max-w-4xl mx-auto">
        {isLoading ? (
            <div className="text-center py-10 text-gray-500">Đang tải danh sách cửa hàng...</div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy cửa hàng nào</p>
          </div>
        ) : (
            filteredStores.map(store => (
            <div
                key={store.id}
                className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
                <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="mb-1 flex items-center gap-2 font-bold text-gray-800">
                    {store.name}
                    {/* <ChevronLeft size={16} className="rotate-180 text-gray-400" /> */}
                    </h3>
                    <p className="text-sm text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded mb-1">
                     Đang mở cửa • {store.prepTime}
                    </p>
                </div>
                {store.image ? (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 ml-3">
                    <img src={store.image} alt={store.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                ) : (
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                    <span className="text-2xl">🏪</span>
                    </div>
                )}
                </div>

                <div className="flex items-start gap-2 mb-3">
                <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">{store.address}</p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-sm text-gray-500">Cách bạn {store.distance}</span>
                </div>

                <button
                onClick={() => onSelectStore(store)}
                className={`w-full py-3 rounded-lg transition-colors font-medium ${
                    selectedStore?.id === store.id
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-900 text-white hover:bg-blue-800'
                }`}
                >
                {selectedStore?.id === store.id ? 'Đã chọn' : 'ĐẶT HÀNG NGAY'}
                </button>
            </div>
            ))
        )}
      </div>
    </div>
  );
}