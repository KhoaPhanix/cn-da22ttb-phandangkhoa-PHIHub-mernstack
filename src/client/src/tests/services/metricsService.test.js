import { describe, it, expect, vi, beforeEach } from 'vitest';
import API from '../../services/api';
import {
  getMetrics,
  createMetric,
  updateMetric,
  deleteMetric,
  getMetricStats,
} from '../../services/metricsService';

// Mock API
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Metrics Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMetrics', () => {
    it('should fetch metrics with params', async () => {
      const mockData = {
        data: {
          success: true,
          data: [
            { _id: '1', metricType: 'weight', value: 70, unit: 'kg' },
            { _id: '2', metricType: 'height', value: 175, unit: 'cm' },
          ],
        },
      };

      API.get.mockResolvedValue(mockData);

      const params = { metricType: 'weight', limit: 10 };
      const result = await getMetrics(params);

      expect(API.get).toHaveBeenCalledWith('/metrics', { params });
      expect(result).toEqual(mockData.data);
      expect(result.data).toHaveLength(2);
    });

    it('should handle empty params', async () => {
      const mockData = { data: { success: true, data: [] } };
      API.get.mockResolvedValue(mockData);

      await getMetrics();

      expect(API.get).toHaveBeenCalledWith('/metrics', { params: {} });
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network error';
      API.get.mockRejectedValue(new Error(errorMessage));

      await expect(getMetrics()).rejects.toThrow(errorMessage);
    });
  });

  describe('createMetric', () => {
    it('should create a new metric', async () => {
      const metricData = {
        metricType: 'weight',
        value: 70,
        unit: 'kg',
        timestamp: new Date().toISOString(),
      };

      const mockResponse = {
        data: {
          success: true,
          data: { _id: '1', ...metricData },
        },
      };

      API.post.mockResolvedValue(mockResponse);

      const result = await createMetric(metricData);

      expect(API.post).toHaveBeenCalledWith('/metrics', metricData);
      expect(result.data._id).toBe('1');
      expect(result.data.metricType).toBe('weight');
    });

    it('should handle validation errors', async () => {
      const invalidData = { metricType: 'weight' }; // Missing required fields
      const errorResponse = {
        response: {
          data: { message: 'Validation error' },
        },
      };

      API.post.mockRejectedValue(errorResponse);

      await expect(createMetric(invalidData)).rejects.toEqual(errorResponse);
    });
  });

  describe('updateMetric', () => {
    it('should update an existing metric', async () => {
      const metricId = '123';
      const updateData = { value: 72, notes: 'Updated' };

      const mockResponse = {
        data: {
          success: true,
          data: { _id: metricId, ...updateData },
        },
      };

      API.put.mockResolvedValue(mockResponse);

      const result = await updateMetric(metricId, updateData);

      expect(API.put).toHaveBeenCalledWith(`/metrics/${metricId}`, updateData);
      expect(result.data.value).toBe(72);
      expect(result.data.notes).toBe('Updated');
    });

    it('should handle not found error', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'Metric not found' },
        },
      };

      API.put.mockRejectedValue(errorResponse);

      await expect(updateMetric('invalid-id', {})).rejects.toEqual(errorResponse);
    });
  });

  describe('deleteMetric', () => {
    it('should delete a metric', async () => {
      const metricId = '123';
      const mockResponse = {
        data: {
          success: true,
          message: 'Metric deleted',
        },
      };

      API.delete.mockResolvedValue(mockResponse);

      const result = await deleteMetric(metricId);

      expect(API.delete).toHaveBeenCalledWith(`/metrics/${metricId}`);
      expect(result.success).toBe(true);
    });
  });

  describe('getMetricStats', () => {
    it('should fetch metric statistics', async () => {
      const mockStats = {
        data: {
          success: true,
          data: {
            average: 70,
            min: 68,
            max: 72,
            count: 5,
          },
        },
      };

      API.get.mockResolvedValue(mockStats);

      const result = await getMetricStats('weight', 7);

      expect(API.get).toHaveBeenCalledWith('/metrics/stats', {
        params: { metricType: 'weight', days: 7 },
      });
      expect(result.data.average).toBe(70);
      expect(result.data.count).toBe(5);
    });

    it('should use default days value', async () => {
      const mockStats = { data: { success: true, data: {} } };
      API.get.mockResolvedValue(mockStats);

      await getMetricStats('weight');

      expect(API.get).toHaveBeenCalledWith('/metrics/stats', {
        params: { metricType: 'weight', days: 7 },
      });
    });
  });
});

