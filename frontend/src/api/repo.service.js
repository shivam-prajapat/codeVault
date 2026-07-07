import api from './axios';

export const repoService = {
  fetchUserRepos: async (userId) => {
    const response = await api.get(`/repo/user/${userId}`);
    return response.data;
  },
  
  createRepo: async (data) => {
    const response = await api.post('/repo/create', data);
    return response.data;
  },

  getAllRepos: async () => {
    const response = await api.get('/repo/all');
    return response.data;
  },
  
  getRepoById: async (id) => {
    const response = await api.get(`/repo/${id}`);
    return response.data;
  }
};
