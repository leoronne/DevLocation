import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'react-toastify/dist/ReactToastify.css';
import "./assets/scss/black-dashboard-react.scss";

var http = require("http");
setInterval(function() {
    http.get("https://devlocationn.herokuapp.com/");
}, 75000); 

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
