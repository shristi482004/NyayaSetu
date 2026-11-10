import api from './client';

export const analysisApi = {
  initiateAnalysis: async (docId) => {
    const response = await api.post(`/analysis/${docId}`);
    return response.data;
  },

  getAnalysis: async (docId) => {
    const response = await api.get(`/analysis/${docId}`);
    return response.data;
  },

  getSummary: async (docId) => {
    const response = await api.get(`/analysis/${docId}/summary`);
    return response.data;
  },

  getFaqs: async (docId) => {
    const response = await api.get(`/analysis/${docId}/faqs`);
    return response.data;
  },

  getFlowchart: async (docId) => {
    const response = await api.get(`/analysis/${docId}/flowchart`);
    return response.data;
  },

  getTimeline: async (docId) => {
    const response = await api.get(`/analysis/${docId}/timeline`);
    return response.data;
  },

  getArguments: async (docId) => {
    const response = await api.get(`/analysis/${docId}/arguments`);
    return response.data;
  },
};

