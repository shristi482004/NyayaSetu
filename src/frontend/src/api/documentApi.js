import api from './client';

export const documentApi = {
  uploadDocument: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  listDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  getDocument: async (docId) => {
    const response = await api.get(`/documents/${docId}`);
    return response.data;
  },

  deleteDocument: async (docId) => {
    const response = await api.delete(`/documents/${docId}`);
    return response.data;
  },
};

