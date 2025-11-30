import api from './api';

// Alerts API
export const getAlerts = (params) => api.get('/alerts', { params });
export const getUnreadCount = () => api.get('/alerts/unread/count');
export const markAlertAsRead = (id) => api.patch(`/alerts/${id}/read`);
export const markAllAlertsAsRead = () => api.patch('/alerts/read-all');
export const resolveAlert = (id) => api.patch(`/alerts/${id}/resolve`);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);
export const createAlert = (data) => api.post('/alerts', data);
export const checkHealthMetrics = () => api.post('/alerts/check-health');
