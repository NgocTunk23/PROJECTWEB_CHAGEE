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
  image: string;
  description: string;
  category?: string;
  descriptionU?: string;
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
  toppings: string[];
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
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
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

  // ✅ NEW: State lưu vị trí người dùng toàn cục
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

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

  // --- 1. LOGIN & REGISTER ---
  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(username, password);
      setCurrentUser(response);
      setUserPoints({ 
        teaLeaves: response.rewardPoints || 0,
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
    if (cartItems.length === 0 || !selectedStore || !currentUser) return;

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = subtotal; 

    const orderPayload = {
      user_id: currentUser.id,
      total_price: finalTotal,
      phone: orderData.customerPhone,
      address: selectedStore.address,
      note: orderData.note,
      items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price,
          note: `${item.size} | ${item.sugar} | ${item.ice}`,
      }))
    };

    try {
      const response = await fetch('http://localhost:8080/api/orders/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentUser.token}`
          },
          body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        let savedOrder;
        try {
            const text = await response.text();
            try {
                savedOrder = JSON.parse(text);
            } catch {
                savedOrder = {
                    id: `ORDER_${Date.now()}`,
                    items: [...cartItems],
                    store: selectedStore,
                    status: 'pending',
                    totalPrice: finalTotal,
                    customerName: orderData.customerName,
                    customerPhone: orderData.customerPhone,
                    paymentMethod: orderData.paymentMethod,
                    orderTime: new Date()
                };
            }
        } catch (e) {
            console.error("Lỗi xử lý response:", e);
        }

        setCartItems([]); 
        CartService.clearCart(); 
        
        if (savedOrder) {
            setOrders(prev => [savedOrder, ...prev]);
            setPendingOrder(savedOrder);
            setShowCheckout(false);
            setShowOrderConfirmation(true);
        }
      } else {
        alert("Đặt hàng thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Có lỗi kết nối đến server!");
    }
  };

  // --- Thêm các dòng này vào phần State của App.tsx ---
  const [appliedVoucher, setAppliedVoucher] = useState<any | null>(null);
  const [discount, setDiscount] = useState(0);

  // Tính Tạm tính (subtotal) từ giỏ hàng hiện tại
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Tính Tổng cộng cuối cùng
  const total = subtotal - discount;

  // Hàm xử lý khi người dùng chọn/hủy mã giảm giá
  const handleApplyVoucher = (voucher: any | null) => {
    setAppliedVoucher(voucher);
    
    if (!voucher) {
      setDiscount(0);
      return;
    }

    let amount = 0;
    // 1. Ưu tiên tính theo phần trăm nếu có
    if (voucher.discountpercentage && voucher.discountpercentage > 0) {
      amount = (subtotal * voucher.discountpercentage) / 100;
      // Chặn mức giảm tối đa (maxdiscount) nếu có trong DB
      if (voucher.maxdiscount && amount > voucher.maxdiscount) {
        amount = voucher.maxdiscount;
      }
    } 
    // 2. Nếu không có phần trăm thì lấy số tiền cố định
    else if (voucher.discountamount) {
      amount = voucher.discountamount;
    }

    setDiscount(amount);
  };

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
        return <OrdersPage orders={orders} onOrderNow={() => setCurrentPage('menu')} />;
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
          total={total} 
          
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
          onPayNow={() => alert('Chức năng đang phát triển')}
          onBackToHome={() => { setShowOrderConfirmation(false); setCurrentPage('home'); }}
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