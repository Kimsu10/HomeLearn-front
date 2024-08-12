
import axios from 'axios';

// 기본 URL 설정
axios.defaults.baseURL = 'http://localhost:8080';

// 요청 인터셉터를 추가하여 요청에 토큰을 포함
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token');
    if (token) {
      config.headers['access'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
