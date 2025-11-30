import api from './api';

// Mood API
export const getMoodLogs = (params) => api.get('/mood', { params });
export const getMoodLog = (id) => api.get(`/mood/${id}`);
export const createMoodLog = (data) => api.post('/mood', data);
export const updateMoodLog = (id, data) => api.put(`/mood/${id}`, data);
export const deleteMoodLog = (id) => api.delete(`/mood/${id}`);
export const getMoodStats = (params) => api.get('/mood/stats', { params });
