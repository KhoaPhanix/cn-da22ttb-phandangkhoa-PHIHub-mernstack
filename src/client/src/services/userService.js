import API from './api';

export const getUserProfile = async () => {
  const response = await API.get('/users/me');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await API.put('/users/me', userData);
  return response.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await API.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
