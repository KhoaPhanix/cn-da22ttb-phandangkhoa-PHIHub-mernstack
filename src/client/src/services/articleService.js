import API from './api';

export const getArticles = async (params = {}) => {
  const response = await API.get('/articles', { params });
  return response.data;
};

export const getArticleById = async (id) => {
  const response = await API.get(`/articles/${id}`);
  return response.data;
};
