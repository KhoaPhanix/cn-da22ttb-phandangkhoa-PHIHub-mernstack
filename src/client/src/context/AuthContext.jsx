import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as loginService, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      // Không log error để tránh spam console
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on mount - CHỈ CHẠY 1 LẦN
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      if (mounted) {
        await checkAuth();
      }
    };
    
    init();
    
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency - chỉ chạy khi mount

  const login = async (credentials) => {
    try {
      const data = await loginService(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Đăng nhập thất bại',
      };
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
