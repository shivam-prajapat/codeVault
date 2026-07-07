import api from './axios';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  
  signup: async (username, email, password) => {
    const response = await api.post('/signup', { username, email, password });
    return response.data;
  },
};
