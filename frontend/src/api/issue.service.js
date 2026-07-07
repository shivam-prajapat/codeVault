import api from './axios';

export const issueService = {
  getIssuesByRepo: async (repoId) => {
    const response = await api.get(`/issue/all/${repoId}`);
    return response.data;
  },
  
  getUserIssues: async (userId) => {
    const response = await api.get(`/issue/user/${userId}`);
    return response.data;
  },
  
  createIssue: async (repoId, data) => {
    const response = await api.post(`/issue/create/${repoId}`, data);
    return response.data;
  },

  updateIssue: async (issueId, data) => {
    const response = await api.put(`/issue/update/${issueId}`, data);
    return response.data;
  },
  
  deleteIssue: async (issueId) => {
    const response = await api.delete(`/issue/delete/${issueId}`);
    return response.data;
  },

  getIssueById: async (issueId) => {
    const response = await api.get(`/issue/${issueId}`);
    return response.data;
  }
};
