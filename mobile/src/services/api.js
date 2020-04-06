import axios from "axios";

const api = axios.create({
  baseURL: "http://devlocationn.herokuapp.com/"
});

export default api;
