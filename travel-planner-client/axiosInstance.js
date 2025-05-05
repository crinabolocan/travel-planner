import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:PORT', // înlocuiește cu portul corespunzător fiecărui serviciu
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
