import api from './api';

// Goals API
export const getGoals = (params) => api.get('/goals', { params });
export const getGoal = (id) => api.get(`/goals/${id}`);
export const createGoal = (data) => api.post('/goals', data);
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data);
export const updateGoalProgress = (id, data) => api.put(`/goals/${id}/progress`, data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);
export const getGoalStats = () => api.get('/goals/stats');
