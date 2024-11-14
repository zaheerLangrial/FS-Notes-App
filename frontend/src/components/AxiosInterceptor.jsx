import axios from 'axios';
import { message } from 'antd';
// import { useNavigate } from 'react-router-dom';

// Helper function to handle navigation
const navigateToLogin = () => {
  window.location.href = '/login';
};

// Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8005/api',
});

// Interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 Unauthorized and retry hasn't been done yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get the refresh token from localStorage
        const refreshToken = localStorage.getItem('refresh_token');

        // If no refresh token is available, navigate to login
        if (!refreshToken) {
          message.error('Session expired. Please log in again.');
          navigateToLogin();
          return Promise.reject(error);
        }

        // Try to refresh the access token
        const response = await axios.post('http://127.0.0.1:8005/api/token/refresh', {
          refresh: refreshToken,
        });

        // Save the new access token
        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Update the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${access}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token failed - clear storage and navigate to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        message.error('Session expired. Please log in again.');
        navigateToLogin();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Add Authorization header to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
