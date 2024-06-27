import axios from "axios";

const BASE_URL = 'https://www.palatte.anandu.site/api/'

const axiosInstance = axios.create({
  baseURL: 'https://www.palatte.anandu.site/api/',

  headers: {
      'Content-Type': 'application/json'
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
      const StoredToken = localStorage.getItem('token');
      const token  = JSON.parse(StoredToken)
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },  
  error => {
      return Promise.reject(error);
  }
);

export default axiosInstance;
