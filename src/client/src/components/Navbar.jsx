import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Bảng điều khiển', icon: 'dashboard' },
    { path: '/metrics', label: 'Nhập liệu', icon: 'edit_note' },
    { path: '/goals', label: 'Mục tiêu', icon: 'flag' },
    { path: '/nutrition', label: 'Dinh dưỡng', icon: 'restaurant' },
    { path: '/mood', label: 'Tâm trạng', icon: 'mood' },
    { path: '/history', label: 'Lịch sử', icon: 'history' },
    { path: '/knowledge', label: 'Kiến thức', icon: 'local_library' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background-dark border-b border-[#3b5447]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <span className="material-symbols-outlined text-background-dark text-2xl">favorite</span>
            </div>
            <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] sm:hidden">PHIHub</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#1c3d2e] text-primary'
                    : 'text-[#9db9ab] hover:bg-[#1c3d2e] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile Dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1c3d2e] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#283930] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#9db9ab]">person</span>
              </div>
              <span className="text-white text-sm font-medium">{user?.name || 'User'}</span>
              <span className="material-symbols-outlined text-[#9db9ab]">
                {showDropdown ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1c3d2e] rounded-lg border border-[#3b5447] shadow-lg py-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-[#9db9ab] hover:bg-[#283930] hover:text-white transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <span className="material-symbols-outlined text-xl">person</span>
                  <span className="text-sm font-medium">Hồ sơ</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-[#9db9ab] hover:bg-[#283930] hover:text-white transition-colors w-full text-left"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                  <span className="text-sm font-medium">Đăng xuất</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span className="material-symbols-outlined">
              {showMobileMenu ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-[#3b5447]">
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-[#1c3d2e] text-primary'
                      : 'text-[#9db9ab] hover:bg-[#1c3d2e] hover:text-white'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9db9ab] hover:bg-[#1c3d2e] hover:text-white transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <span className="material-symbols-outlined text-xl">person</span>
                <span className="text-sm font-medium">Hồ sơ</span>
              </Link>
              <button
                onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9db9ab] hover:bg-[#1c3d2e] hover:text-white transition-colors text-left"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background-dark border-t border-[#3b5447] z-50">
        <div className="flex justify-around py-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive(item.path)
                  ? 'text-primary'
                  : 'text-[#9db9ab]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
