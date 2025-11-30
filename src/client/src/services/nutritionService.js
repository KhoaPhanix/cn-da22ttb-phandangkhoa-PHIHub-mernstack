import api from './api';

// Nutrition API
export const getNutritionLogs = (params) => api.get('/nutrition', { params });
export const getNutritionLog = (id) => api.get(`/nutrition/${id}`);
export const createNutritionLog = (data) => api.post('/nutrition', data);
export const updateNutritionLog = (id, data) => api.put(`/nutrition/${id}`, data);
export const deleteNutritionLog = (id) => api.delete(`/nutrition/${id}`);
export const getNutritionStats = (params) => api.get('/nutrition/stats', { params });
export const getDailyNutrition = (date) => api.get(`/nutrition/daily/${date}`);
