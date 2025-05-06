import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://localhost:5011/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default authApi;
