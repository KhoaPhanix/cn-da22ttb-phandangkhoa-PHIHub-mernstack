import API from './api';

export const getMetrics = async (params = {}) => {
  const response = await API.get('/metrics', { params });
  return response.data;
};

export const createMetric = async (metricData) => {
  const response = await API.post('/metrics', metricData);
  return response.data;
};

export const getMetricStats = async (metricType, days = 7) => {
  const response = await API.get('/metrics/stats', {
    params: { metricType, days },
  });
  return response.data;
};

export const updateMetric = async (id, metricData) => {
  const response = await API.put(`/metrics/${id}`, metricData);
  return response.data;
};

export const deleteMetric = async (id) => {
  const response = await API.delete(`/metrics/${id}`);
  return response.data;
};
