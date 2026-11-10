import api from './client';

export const chatApi = {
  askQuestion: async (docId, question) => {
    const response = await api.post(`/chat/${docId}`, { question });
    return response.data;
  },

  getChatHistory: async (docId) => {
    const response = await api.get(`/chat/${docId}/history`);
    return response.data;
  },
};

