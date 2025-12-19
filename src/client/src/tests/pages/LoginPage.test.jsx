import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from '../../pages/LoginPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock authService
vi.mock('../../services/authService', () => ({
  login: vi.fn(),
}));

import { login } from '../../services/authService';

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should render login form', () => {
    renderLoginPage();

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    renderLoginPage();

    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
      
      expect(emailInput).toBeInvalid();
      expect(passwordInput).toBeInvalid();
    });
  });

  it('should submit form with valid credentials', async () => {
    const mockLoginResponse = {
      data: {
        success: true,
        token: 'mock-token',
        data: { email: 'test@example.com' },
      },
    };

    login.mockResolvedValue(mockLoginResponse);

    renderLoginPage();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
    });
  });

  it('should display error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    login.mockRejectedValue({
      response: {
        data: { message: errorMessage },
      },
    });

    renderLoginPage();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should have link to register page', () => {
    renderLoginPage();

    const registerLink = screen.getByText(/đăng ký ngay/i);
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });
});
