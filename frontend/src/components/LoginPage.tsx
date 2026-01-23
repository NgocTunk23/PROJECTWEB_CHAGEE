import { useState } from 'react';
import { ChevronLeft, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (userData: RegisterData) => void;
  onClose: () => void;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  phone: string;
  full_name: string;
}

export function LoginPage({ onLogin, onRegister, onClose }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState<RegisterData>({
    username: '',
    password: '',
    email: '',
    phone: '',
    full_name: ''
  });

  const [errors, setErrors] = useState<any>({});

  const validateLogin = () => {
    const newErrors: any = {};
    if (!loginData.username.trim()) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    if (!loginData.password.trim()) newErrors.password = 'Vui lòng nhập mật khẩu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: any = {};
    
    if (!registerData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (registerData.username.length < 4) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 4 ký tự';
    }

    if (!registerData.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!registerData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!registerData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(registerData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!registerData.full_name.trim()) {
      newErrors.full_name = 'Vui lòng nhập họ và tên';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateLogin()) {
      onLogin(loginData.username, loginData.password);
    }
  };

  const handleRegister = () => {
    if (validateRegister()) {
      onRegister(registerData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 z-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl flex-1">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto p-6 pb-12">
        {/* Logo */}
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">🍵</span>
          </div>
          <h2 className="text-3xl mb-2 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            CHAGEE
          </h2>
          <p className="text-gray-600">Chào mừng bạn đến với Chagee!</p>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    placeholder="Nhập tên đăng nhập"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.username ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Nhập mật khẩu"
                    className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-lg hover:from-red-700 hover:to-orange-600 transition-all shadow-md"
              >
                Đăng nhập
              </button>
            </div>

            {/* Demo Accounts */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900 mb-2">💡 <strong>Demo accounts:</strong></p>
              <div className="space-y-1 text-xs text-blue-800 font-mono">
                <p>• member01 / 123456789</p>
                <p>• member02 / 123456789</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setIsLogin(false);
                  setErrors({});
                }}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Chưa có tài khoản? <span className="underline">Đăng ký ngay</span>
              </button>
            </div>
          </div>
        ) : (
          /* Register Form */
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={registerData.full_name}
                    onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                    placeholder="Nhập họ và tên"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.full_name ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    placeholder="Nhập tên đăng nhập"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.username ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="Nhập email"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <button
                onClick={handleRegister}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-lg hover:from-red-700 hover:to-orange-600 transition-all shadow-md"
              >
                Đăng ký
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setErrors({});
                }}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Đã có tài khoản? <span className="underline">Đăng nhập</span>
              </button>
            </div>
          </div>
        )}

        {/* Social Login */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 text-gray-500">
                Hoặc đăng nhập bằng
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm">Google</span>
            </button>

            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-sm">Apple</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
