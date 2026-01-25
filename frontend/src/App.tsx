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
import { Voucher, calculateVoucherDiscount } from './data/vouchers';
import { Home, Coffee, ClipboardList, User } from 'lucide-react';

export type NavigationPage = 'home' | 'menu' | 'orders' | 'profile';

// --- Interfaces giữ nguyên ---
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  prepTime: string;
  image?: string;
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
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  totalPrice: number;
  discount?: number;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  orderTime: Date;
}

function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // State dữ liệu
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userPoints, setUserPoints] = useState({ teaLeaves: 0, vouchers: 0 });
  const [currentUser, setCurrentUser] = useState<any>(null);

  // State UI
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  // const [showLogin, setShowLogin] = useState(false); // <-- KHÔNG CẦN DÙNG CÁI NÀY NỮA VÌ TA CHECK currentUser TRỰC TIẾP
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isLoading, setIsLoading] = useState(false);

  // --- 1. LOGIN & REGISTER ---
  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // response lúc này là data trả về từ Backend (JwtResponse)
      // Cấu trúc nó sẽ là: { accessToken, username, email, rewardPoints, roles }
      const response = await AuthService.login(username, password);
      
      // 1. Set Current User (Lấy thẳng từ response, không có .user)
      setCurrentUser(response); 
      
      // 2. Set Points (Lấy thẳng rewardPoints từ response)
      setUserPoints({ 
        teaLeaves: response.rewardPoints || 0, // <--- SỬA CHỖ NÀY
        vouchers: 3 // Vouchers tạm thời hardcode hoặc lấy từ API khác sau
      });

      // Lưu vào localStorage để F5 không bị mất login
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
      setCurrentUser(response.user); // Đăng ký xong vào luôn
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

  // --- 3. CÁC HÀM XỬ LÝ KHÁC (ADD, UPDATE, REMOVE, CHECKOUT) ---
  const addToCart = async (item: CartItem) => {
    if (!currentUser) return; // Đã có rào chắn login ở dưới nên không cần alert ở đây
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
      if (currentUser?.id) {
        const items = await CartService.getCart(currentUser.id);
        setCartItems(items);
      }
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

  const handleCheckout = (voucher: Voucher | null) => {
    setAppliedVoucher(voucher);
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleConfirmOrder = (orderData: OrderData) => {
    if (cartItems.length === 0 || !selectedStore) return;
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = appliedVoucher ? calculateVoucherDiscount(appliedVoucher, subtotal) : 0;
    
    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      items: cartItems,
      store: selectedStore,
      status: 'pending',
      totalPrice: subtotal - discount,
      discount,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      orderTime: new Date()
    };

    setOrders(prev => [newOrder, ...prev]);
    setPendingOrder(newOrder);
    setCartItems([]);
    setShowCheckout(false);
    setShowOrderConfirmation(true);
  };

  // --- 4. RENDER GIAO DIỆN CHÍNH (SIDEBAR + MAIN CONTENT) ---
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            userPoints={userPoints}
            selectedStore={selectedStore}
            onSelectStore={() => setIsStoreSelectorOpen(true)}
            onNavigateToMenu={() => setCurrentPage('menu')}
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
            onOpenLogin={() => {}} // Đã login rồi thì hàm này vô nghĩa
          />
        );
      default:
        return null;
    }
  };

  // ==========================================
  // LOGIC HIỂN THỊ CHÍNH (QUAN TRỌNG NHẤT)
  // ==========================================
  
  // 1. Nếu chưa đăng nhập -> HIỆN TRANG LOGIN FULL MÀN HÌNH
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        // Truyền hàm rỗng để không cho phép đóng popup (bắt buộc login)
        onClose={() => {}} 
      />
    );
  }

  // 2. Nếu đã đăng nhập -> HIỆN GIAO DIỆN CHÍNH CỦA APP
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

      {/* Các Modal / Popup chức năng */}
      {isStoreSelectorOpen && (
        <StoreSelector
          selectedStore={selectedStore}
          onSelectStore={(store) => {
            setSelectedStore(store);
            setIsStoreSelectorOpen(false);
          }}
          onClose={() => setIsStoreSelectorOpen(false)}
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
          appliedVoucher={appliedVoucher}
          subtotal={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          discount={appliedVoucher ? calculateVoucherDiscount(appliedVoucher, cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)) : 0}
          total={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) - (appliedVoucher ? calculateVoucherDiscount(appliedVoucher, cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)) : 0)}
          onConfirmOrder={handleConfirmOrder}
          onBack={() => { setShowCheckout(false); setShowCart(true); }}
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
          onPayNow={() => alert('Thanh toán online...')}
          onBackToHome={() => { setShowOrderConfirmation(false); setCurrentPage('home'); }}
        />
      )}
    </div>
  );
}

export default App;