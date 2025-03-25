import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';

// Add a request interceptor to include auth headers and log requests
axios.interceptors.request.use(
  (config) => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    // If user exists, add their ID to the headers
    if (user && user.id) {
      config.headers['x-user-id'] = user.id;
    }
    
    console.log('Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to log responses
axios.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response ? {
      status: error.response.status,
      data: error.response.data,
      message: error.message
    } : error.message);
    return Promise.reject(error);
  }
);

export default axios;
