import { describe, it, expect, vi, beforeEach } from 'vitest';
import API from '../../services/api';
import { register, login, logout, getMe } from '../../services/authService';

vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login user and store token', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockResponse = {
        data: {
          success: true,
          token: 'mock-jwt-token',
          data: {
            _id: '1',
            email: 'test@example.com',
            fullName: 'Test User',
          },
        },
      };

      API.post.mockResolvedValue(mockResponse);

      const result = await login(credentials);

      expect(API.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result.success).toBe(true);
      expect(result.data._id).toBe('1');
    });

    it('should handle login errors', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      };

      API.post.mockRejectedValue(errorResponse);

      await expect(login({ email: 'test@example.com', password: 'wrong' }))
        .rejects.toEqual(errorResponse);
    });
  });

  describe('register', () => {
    it('should register new user and store token', async () => {
      const userData = {
        fullName: 'New User',
        email: 'new@example.com',
        password: 'Password123!',
      };

      const mockResponse = {
        data: {
          success: true,
          token: 'mock-jwt-token',
          data: {
            _id: '1',
            ...userData,
          },
        },
      };

      API.post.mockResolvedValue(mockResponse);

      const result = await register(userData);

      expect(API.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result.success).toBe(true);
      expect(result.data.email).toBe('new@example.com');
    });

    it('should handle validation errors', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { message: 'Email already exists' },
        },
      };

      API.post.mockRejectedValue(errorResponse);

      await expect(register({ email: 'existing@example.com' }))
        .rejects.toEqual(errorResponse);
    });
  });

  describe('logout', () => {
    it('should call logout API', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Logged out successfully',
        },
      };

      API.post.mockResolvedValue(mockResponse);

      const result = await logout();

      expect(API.post).toHaveBeenCalledWith('/auth/logout');
      expect(result.success).toBe(true);
    });
  });

  describe('getMe', () => {
    it('should fetch current user data', async () => {
      const mockUser = {
        data: {
          success: true,
          data: {
            _id: '1',
            email: 'test@example.com',
            fullName: 'Test User',
          },
        },
      };

      API.get.mockResolvedValue(mockUser);

      const result = await getMe();

      expect(API.get).toHaveBeenCalledWith('/auth/me');
      expect(result.data._id).toBe('1');
    });

    it('should handle unauthorized errors', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      API.get.mockRejectedValue(errorResponse);

      await expect(getMe()).rejects.toEqual(errorResponse);
    });
  });
});

