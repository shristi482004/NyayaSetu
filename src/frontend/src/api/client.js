import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 seconds for AI operations
});

// Attach JWT access token to every outgoing request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nyayasetu_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401s and token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      if (localStorage.getItem('nyayasetu_token')) {
        localStorage.removeItem('nyayasetu_token');
        localStorage.removeItem('nyayasetu_user');
        window.dispatchEvent(new Event('auth-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;

