import api from './axios';

export const userService = {
  getUserProfile: async (userId) => {
    const response = await api.get(`/userProfile/${userId}`);
    return response.data;
  },

  updateUserProfile: async (userId, data) => {
    const response = await api.put(`/updateProfile/${userId}`, data);
    return response.data;
  }
};
