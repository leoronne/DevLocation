import axios from 'axios';

const api = axios.create({
      baseURL: 'https://devlocationn.herokuapp.com/'
      // baseURL: 'http://localhost:8080/'
});

export default api;