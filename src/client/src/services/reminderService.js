import api from './api';

// Reminders API
export const getReminders = (params) => api.get('/reminders', { params });
export const getReminder = (id) => api.get(`/reminders/${id}`);
export const createReminder = (data) => api.post('/reminders', data);
export const updateReminder = (id, data) => api.put(`/reminders/${id}`, data);
export const toggleReminder = (id) => api.patch(`/reminders/${id}/toggle`);
export const deleteReminder = (id) => api.delete(`/reminders/${id}`);
export const getUpcomingReminders = (params) => api.get('/reminders/upcoming', { params });
