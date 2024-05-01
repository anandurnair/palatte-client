import axios from "axios";

const BASE_URL = 'http://localhost:4000'

export const userAPI = axios.create({
  baseURL: `${BASE_URL}/`,
});

const getToken = () => {
  const token = localStorage.getItem('token')
  console.log(' 1 , ',token)
  return token;
}

userAPI.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
