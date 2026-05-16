import React, { useState, useEffect, Suspense } from 'react';
import { EventBus, Product } from '../../shared/eventBus';
import { Layout, User, ShoppingBag, Menu, Plus, Minus, Trash2, LogOut, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Chú ý: Ở thực tế, ProductList sẽ được import dynamic từ Remote
// Trong ví dụ này để chạy được ngay, tôi sẽ import trực tiếp nhưng giải thích cách Remote hoạt động
import ProductList from '../../product-mfe/src/ProductList';

const App = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [user, setUser] = useState<{name: string, phone: string, email: string, address: string} | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [newName, setNewName] = useState("");
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  const login = () => {
    setIsLoginModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.address.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setUser({ ...formData });
    setIsLoginModalOpen(false);
    
    // Nếu giỏ hàng đang có đồ và vừa click từ nút thanh toán thì tiện tay thanh toán luôn (tùy chọn)
    if (cartItems.length > 0 && isCartOpen) {
        setIsSuccessOpen(true);
        setCartItems([]);
        setIsCartOpen(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsUserMenuOpen(false);
    setFormData({ name: "", phone: "", email: "", address: "" });
  };

  const updateName = () => {
    if (newName.trim()) {
      setUser(prev => prev ? { ...prev, name: newName } : null);
      setNewName("");
    }
  };

  useEffect(() => {
    // Lắng nghe sự kiện từ Product MFE
    const unsubscribe = EventBus.subscribe('ADD_TO_CART', (product: Product) => {
      setCartItems((prev) => {
        const existingItem = prev.find(item => item.id === product.id);
        if (existingItem) {
          // Nếu đã có, tăng số lượng lên 1
          return prev.map(item => 
            item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
          );
        }
        // Nếu chưa có, thêm mới với quantity = 1
        return [...prev, { ...product, quantity: 1 }];
      });
      setIsCartOpen(true);
    });

    return () => unsubscribe();
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = (item.quantity || 1) + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => (item.quantity || 0) > 0); // Xóa nếu số lượng <= 0
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsSuccessOpen(true);
    setCartItems([]);
    setIsCartOpen(false);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header - Thuộc về App Shell */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Layout />
            <span>MFE E-Commerce</span>
          </div>
          
          <nav className="hidden md:flex gap-8 font-medium">
            <a href="#" className="text-blue-600 border-b-2 border-blue-600">Cửa hàng</a>
          </nav>

          <div className="flex items-center gap-4 relative">
            <button 
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsCartOpen(!isCartOpen)}
              id="cart-button"
            >
              <ShoppingBag size={24} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItemsCount}
                </span>
              )}
            </button>
            
            {/* User Profile Section */}
            <div className="relative">
              <button 
                className={`p-2 rounded-full transition-colors flex items-center gap-2 ${user ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                id="user-button"
              >
                <User size={24} />
                {user && <span className="hidden md:block text-sm font-semibold">{user.name}</span>}
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                    >
                      {user ? (
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Xin chào,</p>
                              <p className="font-bold text-sm truncate w-32">{user.name}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Đổi tên hiển thị</label>
                              <div className="flex gap-1">
                                <input 
                                  type="text" 
                                  placeholder="Tên mới..."
                                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                  value={newName}
                                  onChange={(e) => setNewName(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && updateName()}
                                />
                                <button 
                                  onClick={updateName}
                                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                            
                            <hr className="border-gray-100" />
                            
                            <button 
                              onClick={logout}
                              className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <LogOut size={16} /> Đăng xuất
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <User size={32} />
                          </div>
                          <p className="text-gray-500 text-sm mb-4">Bạn chưa đăng nhập</p>
                          <button 
                            onClick={login}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                          >
                            Đăng nhập ngay
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-8">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-8 text-blue-800 text-sm italic">
          Chào mừng đến với App Shell! Vùng dưới đây được "nhúng" từ Product MFE.
        </div>

        {/* Nơi nhúng Remote MFE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
          <Suspense fallback={<div className="p-10 text-center">Đang tải Remote MFE...</div>}>
             <ProductList />
          </Suspense>
        </div>
      </main>

      {/* Cart Drawer (Minh hoạ Cart MFE logic) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag /> Giỏ hàng của bạn</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-black">Đóng</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">Giỏ hàng trống rỗng</div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <img src={item.image} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-blue-600 font-bold mb-2">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </p>
                        
                        {/* Bộ điều khiển số lượng */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold border-x border-gray-100">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <span className="text-xs text-gray-400">
                            Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * (item.quantity || 1))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Tổng cộng:</span>
                  <span className="font-bold text-xl text-blue-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                  </span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Thanh toán ngay
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {isSuccessOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSuccessOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[110] p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán hoàn tất!</h2>
              <p className="text-gray-500 mb-8 px-4">
                Đơn hàng của bạn đã được tiếp nhận. Chúng tôi sẽ xử lý và giao hàng sớm nhất có thể.
              </p>
              <button 
                onClick={() => setIsSuccessOpen(false)}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
              >
                Tiếp tục mua sắm
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login / Registration Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[110] p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông tin giao hàng</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Vui lòng điền đầy đủ thông tin để hoàn tất thanh toán.
              </p>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="VD: 0987654321"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="VD: email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng *</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="VD: Số 123 Đường Ngọc Hồi..."
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    Hoàn tất
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto py-12 px-4 border-t border-gray-200 text-center text-gray-500 text-sm">
        &copy; 2026 Micro-frontend E-commerce Demo • Được xây dựng cho người mới bắt đầu
      </footer>
    </div>
  );
};

export default App;
