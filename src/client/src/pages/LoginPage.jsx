import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Email hoặc mật khẩu không chính xác.');
    }
    
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display">
      <div className="flex h-full min-h-screen grow flex-col">
        <div className="flex flex-1">
          <div className="flex w-full flex-col lg:flex-row">
            {/* Left Panel - Branding */}
            <div className="relative flex h-64 w-full flex-col items-center justify-center bg-[#111814] p-8 lg:h-auto lg:w-1/2">
              <div 
                className="absolute inset-0 h-full w-full bg-cover bg-center opacity-20" 
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80")'
                }}
              />
              <div className="relative z-10 flex max-w-md flex-col gap-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                    <span className="material-symbols-outlined text-background-dark !text-3xl">health_and_safety</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white">Trung tâm Thông minh Sức khỏe Cá nhân</h1>
                </div>
                <p className="text-base font-normal text-slate-300">
                  Đăng nhập vào tài khoản của bạn để bắt đầu theo dõi và cải thiện sức khỏe một cách thông minh và hiệu quả.
                </p>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-8 lg:w-1/2">
              <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex flex-col gap-2 text-left">
                  <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Chào mừng trở lại
                  </h1>
                  <p className="font-display text-base font-normal text-gray-600 dark:text-gray-400">
                    Vui lòng nhập thông tin chi tiết của bạn để đăng nhập.
                  </p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <label className="flex flex-col">
                    <p className="font-display pb-2 text-sm font-medium text-gray-700 dark:text-white">Email</p>
                    <div className="relative flex w-full flex-1 items-stretch">
                      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        mail
                      </span>
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-3 pl-10 text-base font-normal text-gray-900 placeholder:text-gray-400 focus:border-primary/50 focus:outline-0 focus:ring-4 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary/50"
                        placeholder="nguyenvana@email.com"
                      />
                    </div>
                  </label>

                  {/* Password Input */}
                  <label className="flex flex-col">
                    <p className="font-display pb-2 text-sm font-medium text-gray-700 dark:text-white">Mật khẩu</p>
                    <div className="relative flex w-full flex-1 items-stretch">
                      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        lock
                      </span>
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-3 pl-10 pr-10 text-base font-normal text-gray-900 placeholder:text-gray-400 focus:border-primary/50 focus:outline-0 focus:ring-4 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary/50"
                        placeholder="Nhập mật khẩu của bạn"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </label>

                  {/* Error Message Area */}
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      <span className="material-symbols-outlined !text-xl">error</span>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember-me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="form-checkbox h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <label htmlFor="remember-me" className="font-display text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ghi nhớ đăng nhập
                      </label>
                    </div>
                    <a href="#" className="font-display text-sm font-medium text-primary/80 hover:text-primary">
                      Quên mật khẩu?
                    </a>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary text-base font-bold text-background-dark shadow-sm transition-all hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-50"
                  >
                    <span className="truncate">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
                  </button>

                  {/* Sign-up Link */}
                  <p className="text-center font-display text-sm text-gray-600 dark:text-gray-400">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="font-bold text-primary/80 hover:text-primary">
                      Đăng ký ngay
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
