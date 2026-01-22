import { useState } from 'react';
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
import { branches } from './data/branches';
import { products } from './data/products';
import { Voucher, calculateVoucherDiscount } from './data/vouchers';
import { Home, Coffee, ClipboardList, User } from 'lucide-react';

export type NavigationPage = 'home' | 'menu' | 'orders' | 'profile';

// Type definitions dựa theo SQL Schema
export interface Product {
  id: string;
  product_id?: string;
  name: string;
  nameEn?: string;
  product_name?: string;
  description: string;
  descriptionU?: string;
  price: number;
  display_price?: number;
  originalPrice?: number;
  image: string;
  product_image?: string | null;
  category: string;
  isBestseller?: boolean;
  isDeal?: boolean;
  sold_quantity?: number;
}

export interface Store {
  id: string;
  branch_id?: string;
  name: string;
  branch_name?: string;
  address: string;
  addressU?: string;
  distance: string;
  prepTime: string;
  image?: string;
  manager_username?: string;
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
  order_id?: string;
  items: CartItem[];
  store: Store;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderType: 'pickup' | 'delivery';
  totalPrice: number;
  discount?: number;
  appliedVoucher?: Voucher;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  orderTime: Date;
  payment_time?: Date;
  completion_time?: Date;
}

function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userPoints, setUserPoints] = useState({ teaLeaves: 0, vouchers: 3 });
  
  // New states for checkout flow
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const addToCart = (item: CartItem) => {
    const newItem = {
      ...item,
      id: `${item.product.id}-${Date.now()}-${Math.random()}`
    };
    setCartItems(prev => [...prev, newItem]);
    setSelectedProduct(null);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => item.id === itemId ? { ...item, quantity } : item)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
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
    const total = subtotal - discount;

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      order_id: `ORD${Date.now()}`,
      items: cartItems,
      store: selectedStore,
      status: 'pending',
      orderType: 'pickup',
      totalPrice: total,
      discount,
      appliedVoucher: appliedVoucher || undefined,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      paymentMethod: orderData.paymentMethod,
      orderTime: new Date()
    };

    setOrders(prev => [newOrder, ...prev]);
    setPendingOrder(newOrder);
    setCartItems([]);
    setShowCheckout(false);
    setShowOrderConfirmation(true);
  };

  const handlePayNow = () => {
    alert('Chuyển đến trang thanh toán...');
    // TODO: Implement payment gateway
  };

  const handleLogin = (username: string, password: string) => {
    // Mock login - In production, call API
    const mockUser = {
      username,
      full_name: username === 'member01' ? 'Nguyễn Văn An' : 'Trần Nhi',
      reward_points: username === 'member01' ? 120 : 300,
      membership_tier: username === 'member01' ? 'Silver' : 'Gold'
    };
    setCurrentUser(mockUser);
    setUserPoints({ teaLeaves: mockUser.reward_points, vouchers: 3 });
    setShowLogin(false);
  };

  const handleRegister = (data: RegisterData) => {
    // Mock register - In production, call API
    const newUser = {
      username: data.username,
      full_name: data.full_name,
      reward_points: 0,
      membership_tier: 'Member'
    };
    setCurrentUser(newUser);
    setShowLogin(false);
  };

  const placeOrder = (orderType: 'pickup' | 'delivery') => {
    if (cartItems.length === 0 || !selectedStore) return;

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      items: cartItems,
      store: selectedStore,
      status: 'pending',
      orderType,
      totalPrice: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      orderTime: new Date()
    };

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
  };

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
            onOpenLogin={() => setShowLogin(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Main Content */}
      <div className="md:max-w-7xl md:mx-auto md:flex md:gap-6 md:py-6">
        {/* Desktop Sidebar */}
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
                  currentPage === item.id
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:bg-white md:rounded-lg md:shadow-sm md:overflow-hidden">
          {renderPage()}
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
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

      {/* Store Selector Modal */}
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

      {/* Product Detail Modal */}
      {selectedProduct && selectedStore && (
        <ProductDetail
          product={selectedProduct}
          store={selectedStore}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Cart Page */}
      {showCart && (
        <CartPage
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateCartQuantity}
          onCheckout={handleCheckout}
          onClose={() => setShowCart(false)}
        />
      )}

      {/* Checkout Page */}
      {showCheckout && (
        <CheckoutPage
          cartItems={cartItems}
          selectedStore={selectedStore}
          appliedVoucher={appliedVoucher}
          subtotal={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          discount={appliedVoucher ? calculateVoucherDiscount(appliedVoucher, cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)) : 0}
          total={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) - (appliedVoucher ? calculateVoucherDiscount(appliedVoucher, cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)) : 0)}
          onConfirmOrder={handleConfirmOrder}
          onBack={() => {
            setShowCheckout(false);
            setShowCart(true);
          }}
        />
      )}

      {/* Order Confirmation Page */}
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
          onPayNow={handlePayNow}
          onBackToHome={() => {
            setShowOrderConfirmation(false);
            setCurrentPage('home');
          }}
        />
      )}

      {/* Login Page */}
      {showLogin && (
        <LoginPage
          onLogin={handleLogin}
          onRegister={handleRegister}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}

export default App;