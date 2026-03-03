import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { MenuPage } from './components/MenuPage';
import { OrdersPage } from './components/OrdersPage';
import { ProfilePage } from './components/ProfilePage';
import { StoreSelector } from './components/StoreSelector';
import { ProductDetail } from './components/ProductDetail';
import { CartPage } from './components/CartPage';
import { CheckoutPage, OrderData } from './components/CheckoutPage';
import { OrderConfirmation } from './components/OrderConfirmation';
import { LoginPage, RegisterData } from './components/LoginPage';
import { CartService } from './services/cartService';
import { AuthService } from './services/authService';
import { Home, Coffee, ClipboardList, User, ShoppingBag } from 'lucide-react';


export type NavigationPage = 'home' | 'menu' | 'orders' | 'profile';

// --- Interfaces ---
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string; // ✅ Thêm dòng này để khớp với Backend và SQL
  description: string;
  category?: string;
  descriptionU?: string;
}

export interface Voucher {
  vouchercode: string;
  vouchername: string;
  discountamount: number;
  discountpercentage: number;
  minordervalue: number;
  expirydate: string;
  usage_left: number; // ✅ THÊM DÒNG NÀY
}


export interface Store {
  // --- 1. Các trường cũ ---
  id: string;        
  name: string;      
  address: string;   
  distance: string;  
  prepTime: string;  
  image?: string;    

  // --- 2. Các trường MỚI ---
  latitude?: number;       
  longitude?: number;      
  openTime?: string;       
  closeTime?: string;      
  isOpen?: boolean;     
  // Biến phụ để sắp xếp (ẩn)
  _sortDistance?: number;  // Khoảng cách dạng số (km)
}

export interface CartItem {
  id: string;
  product: Product;
  name: string;
  image: string;
  price: number;
  size: string;
  sugar: string;
  ice: string;
  quantity: number;
  store: Store;
}

export interface Order {
  id: string;
  items: CartItem[];
  store: Store;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  totalPrice: number;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  orderTime: Date;
}

export interface SizeOption {
  name: string;
  price: number;
}

export interface CustomizationOptions {
  size: SizeOption[];
  sugar: string[];
  ice: string[];
  toppings: string[];
}

function App() {
  // State điều hướng & UI
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  // Trong App.tsx
  const [selectedStore, setSelectedStore] = useState<Store | null>(() => {
    // 1. Kiểm tra xem máy khách có đang lưu cửa hàng nào không
    const savedStore = localStorage.getItem('selectedStore');
    
    // 2. Nếu có thì trả về object, không thì trả về null
    return savedStore ? JSON.parse(savedStore) : null;
  });

  const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isLoading, setIsLoading] = useState(false);

  // State dữ liệu
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userPoints, setUserPoints] = useState({ teaLeaves: 0, vouchers: 0 });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);

  // 1. Nhớ khai báo kiểu dữ liệu cho State để tránh lỗi "never"
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  // ✅ NEW: State lưu vị trí người dùng toàn cục
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [activeTab, setActiveTab] = useState('home'); // Hoặc 'menu' tùy ông

  // ✅ NEW: Lấy vị trí ngay khi khởi động App
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log("📍 Đã lấy vị trí thành công từ lúc khởi động");
        },
        (error) => {
          console.error("❌ User từ chối hoặc lỗi GPS:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Thêm useEffect này vào App.tsx
  useEffect(() => {
    if (selectedStore) {
      // Lưu object cửa hàng dưới dạng string vào Local Storage
      localStorage.setItem('selectedStore', JSON.stringify(selectedStore));
    }
  }, [selectedStore]); // Chạy lại mỗi khi selectedStore thay đổi

  // --- 1. LOGIN & REGISTER ---
  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(username, password);
      setCurrentUser(response);
      setUserPoints({ 
        teaLeaves: response.rewardpoints || 0,
        vouchers: 0 
      });
      localStorage.setItem("user", JSON.stringify(response));
    } catch (error) {
      console.error("Login failed:", error);
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register(data);
      setCurrentUser(response.user);
      alert("Đăng ký thành công!");
    } catch (error) {
      console.error("Register failed:", error);
      alert("Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. LOAD GIỎ HÀNG TỪ DB ---
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setUserPoints({ teaLeaves: parsedUser.rewardPoints || 0, vouchers: 0 });
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      const fetchCart = async () => {
        try {
          const items = await CartService.getCart(currentUser.id);
          setCartItems(items);
        } catch (error) {
          console.error("Failed to load cart:", error);
        }
      };
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [currentUser]);

  // --- 3. CÁC HÀM XỬ LÝ GIỎ HÀNG ---
  const addToCart = async (item: CartItem) => {
    if (!currentUser) return;
    try {
      await CartService.addToCart(item, currentUser.id);
      const updatedCart = await CartService.getCart(currentUser.id);
      setCartItems(updatedCart);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
    try {
      await CartService.updateQuantity(itemId, quantity);
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await CartService.removeItem(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Remove item error:", error);
    }
  };

  // --- 4. CHECKOUT & ORDER ---
  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

const handleConfirmOrder = async (orderData: OrderData) => {
  // 1. Kiểm tra điều kiện tiên quyết
  if (cartItems.length === 0 || !selectedStore || !currentUser) return;

  // 2. Tính toán tiền nong
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = subtotal - (discount || 0);

  // 3. 📦 ĐÓNG GÓI DỮ LIỆU - PHẢI KHỚP TÊN VỚI BACKEND
  const orderPayload = {
    // Đổi user_id -> buyerusername để khớp với OrderController
    buyerusername: currentUser.username || currentUser.id, 
    
    // Đổi total_price -> originalprice để khớp với Java Entity
    originalprice: finalTotal, 
    
    // Đổi phone -> phonenumber
    phonenumber: orderData.customerPhone,
    
    // Gửi mã voucher để Trigger SQL tự xử lý (Java không xóa nữa)
    vouchercode: appliedVoucher?.vouchercode || null, 
    
    address: selectedStore.address,
    branchid: selectedStore.id, // Đảm bảo có branchid cho Backend
    note: orderData.note,
    
    // Đổi payment_method -> paymentmethod (bỏ dấu gạch dưới)
    paymentmethod: orderData.paymentMethod, 
    
    items: cartItems.map(item => ({
      productid: item.product.id, // Đổi product_id -> productid
      quantity: item.quantity,
      price: item.price,
      note: `${item.size} | ${item.sugar} | ${item.ice}`
    }))
  };

  // 🔍 DEBUG: In payload ra console trước khi gửi để ông soi
  console.log("🚀 [DEBUG] Payload gửi lên Backend:", JSON.stringify(orderPayload, null, 2));

  try {
    // 4. Gọi API tạo đơn hàng
    const response = await fetch('http://localhost:8080/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      },
      body: JSON.stringify(orderPayload)
    });

    if (response.ok) {
      const text = await response.text();
      console.log("✅ [DEBUG] Server trả về:", text);
      
      let savedOrder;
      try {
        savedOrder = JSON.parse(text);
      } catch {
        // Tự tạo object để hiển thị nếu backend trả về chuỗi text đơn giản
        savedOrder = {
          id: `ORD_${Date.now()}`,
          items: [...cartItems],
          store: selectedStore,
          status: 'pending',
          totalPrice: finalTotal,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          paymentMethod: orderData.paymentMethod,
          appliedVoucher: appliedVoucher,
          orderTime: new Date()
        };
      }

      // 5. Dọn dẹp State
      setCartItems([]); 
      CartService.clearCart(); 
      setAppliedVoucher(null);
      setDiscount(0);
      
      // 6. Chuyển màn hình
      if (savedOrder) {
        setOrders(prev => [savedOrder, ...prev]);
        setPendingOrder(savedOrder);
        setShowCheckout(false);
        setShowOrderConfirmation(true);
      }
    } else {
      // 🔍 DEBUG: Lấy nội dung lỗi cụ thể từ Backend
      const errorMsg = await response.text();
      console.error("❌ [LỖI SERVER 500]:", errorMsg);
      alert(`Đặt hàng thất bại: ${errorMsg || "Lỗi hệ thống!"}`);
    }
  } catch (error) {
    console.error("🌐 [LỖI KẾT NỐI]:", error);
    alert("Không thể kết nối đến server!");
  }
};
  // --- Sửa lại phần State trong App.tsx ---
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discount, setDiscount] = useState(0);

  // Hàm tính toán chiết khấu dùng chung
  const calculateDiscount = (voucher: Voucher | null, currentSubtotal: number) => {
    if (!voucher) return 0;
    let amount = 0;
    if (voucher.discountpercentage && voucher.discountpercentage > 0) {
      amount = (currentSubtotal * voucher.discountpercentage) / 100;
    } else if (voucher.discountamount) {
      amount = voucher.discountamount;
    }
    return amount;
  };

  // Hàm xử lý khi chọn voucher (Dùng chung cho cả Cart và Checkout)
  const handleApplyVoucher = (voucher: Voucher | null) => {
    setAppliedVoucher(voucher);
    const amount = calculateDiscount(voucher, subtotal);
    setDiscount(amount);
  };

  // Tính Tạm tính (subtotal) từ giỏ hàng hiện tại
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Tính Tổng cộng cuối cùng
  const total = subtotal - discount;

  // // Hàm xử lý khi người dùng chọn/hủy mã giảm giá
  // const handleApplyVoucher = (voucher: any | null) => {
  //   setAppliedVoucher(voucher);
    
  //   if (!voucher) {
  //     setDiscount(0);
  //     return;
  //   }

  //   let amount = 0;
  //   // 1. Ưu tiên tính theo phần trăm nếu có
  //   if (voucher.discountpercentage && voucher.discountpercentage > 0) {
  //     amount = (subtotal * voucher.discountpercentage) / 100;
  //     // Chặn mức giảm tối đa (maxdiscount) nếu có trong DB
  //     if (voucher.maxdiscount && amount > voucher.maxdiscount) {
  //       amount = voucher.maxdiscount;
  //     }
  //   } 
  //   // 2. Nếu không có phần trăm thì lấy số tiền cố định
  //   else if (voucher.discountamount) {
  //     amount = voucher.discountamount;
  //   }

  //   setDiscount(amount);
  // };

  // --- 5. RENDER TRANG ---
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            selectedStore={selectedStore}
            onSelectStore={() => setIsStoreSelectorOpen(true)}
            onNavigateToMenu={() => setCurrentPage('menu')}
            currentUser={currentUser}
          />
        );
      case 'menu':
        return (
          <MenuPage
            selectedStore={selectedStore}
            onSelectStore={() => setIsStoreSelectorOpen(true)}
            onProductClick={setSelectedProduct}
            onAddToCart={addToCart}
            cartItems={cartItems}
            onOpenCart={() => setShowCart(true)}
          />
        );
      case 'orders':
        return <OrdersPage currentUser={currentUser} // Truyền user vào để nó biết lấy đơn của ai
                           onOrderNow={() => setActiveTab('menu')} 
/>
      case 'profile':
        return (
          <ProfilePage 
            userPoints={userPoints} 
            orders={orders}
            currentUser={currentUser}
            onOpenLogin={() => {}} 
          />
        );
      default:
        return null;
    }
  };

  // --- MAIN UI ---
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        onClose={() => {}} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <div className="md:max-w-7xl md:mx-auto md:flex md:gap-6 md:py-6">
        {/* Sidebar */}
        <aside className="hidden md:block md:w-64 bg-white rounded-lg shadow-sm h-fit sticky top-6">
          <nav className="p-4 space-y-2">
            {[
              { id: 'home' as NavigationPage, icon: Home, label: 'Trang chủ' },
              { id: 'menu' as NavigationPage, icon: Coffee, label: 'Thực đơn' },
              { id: 'orders' as NavigationPage, icon: ClipboardList, label: 'Đơn hàng' },
              { id: 'profile' as NavigationPage, icon: User, label: 'Tôi' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:bg-white md:rounded-lg md:shadow-sm md:overflow-hidden">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4">
          {[
            { id: 'home' as NavigationPage, icon: Home, label: 'Trang chủ' },
            { id: 'menu' as NavigationPage, icon: Coffee, label: 'Thực đơn' },
            { id: 'orders' as NavigationPage, icon: ClipboardList, label: 'Đơn hàng' },
            { id: 'profile' as NavigationPage, icon: User, label: 'Tôi' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center py-2 ${
                currentPage === item.id ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Modals */}
      {isStoreSelectorOpen && (
        <StoreSelector
          selectedStore={selectedStore}
          onSelectStore={(store) => {
            setSelectedStore(store);
            setIsStoreSelectorOpen(false);
          }}
          onClose={() => setIsStoreSelectorOpen(false)}
          userLocation={userLocation} // ✅ TRUYỀN USER LOCATION XUỐNG
        />
      )}

      {selectedProduct && selectedStore && (
        <ProductDetail
          product={selectedProduct}
          store={selectedStore}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {showCart && (
        <CartPage
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateCartQuantity}
          onCheckout={handleCheckout}
          onClose={() => setShowCart(false)}
          currentUser={currentUser}
          onApplyVoucher={handleApplyVoucher} // ✅ Dùng hàm xử lý chung để tính discount ngay lập tức
        />
      )}

      {showCheckout && (
        <CheckoutPage
          cartItems={cartItems}
          selectedStore={selectedStore}
          
          // ✅ THAY null BẰNG BIẾN STATE
          appliedVoucher={appliedVoucher} 
          
          subtotal={subtotal}
          
          // ✅ THAY 0 BẰNG BIẾN STATE
          discount={discount} 
          
          // ✅ DÙNG BIẾN TỔNG ĐÃ TÍNH TOÁN
          total={subtotal - discount} // ✅ Truyền tổng tiền đã trừ giảm giá
          
          onConfirmOrder={handleConfirmOrder}
          onBack={() => { setShowCheckout(false); setShowCart(true); }}
          currentUser={currentUser}
          onApplyVoucher={handleApplyVoucher}
        />
      )}

      {showOrderConfirmation && pendingOrder && (
        <OrderConfirmation
          orderId={pendingOrder.id}
          orderData={{
            customerName: pendingOrder.customerName || '',
            customerPhone: pendingOrder.customerPhone || '',
            paymentMethod: (pendingOrder.paymentMethod as any) || 'COD',
            note: ''
          }}
          selectedStore={selectedStore}
          total={pendingOrder.totalPrice}
          appliedVoucher={appliedVoucher} // ✅ Đồng bộ biến appliedVoucher
          onPayNow={() => alert('Chức năng đang phát triển')}
          onBackToHome={() => { 
            setShowOrderConfirmation(false); 
            setAppliedVoucher(null); // Reset voucher sau khi xong
            setDiscount(0);
            setCurrentPage('home'); 
          }}
        />
      )}
      {cartItems.length > 0 && !showCart && !showCheckout && (
        <button 
          onClick={() => setShowCart(true)} 
          className="fixed bottom-20 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center z-[9999] hover:scale-110 active:scale-95 transition-transform md:bottom-10"
        >
          <ShoppingBag size={24} />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 border-2 border-white rounded-full text-[10px] flex items-center justify-center font-bold">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
          </span>
        </button>
      )}
    </div>
  );
}

export default App;