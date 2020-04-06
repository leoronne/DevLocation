import api from './api';

export default function isAuthenticated() {
      async function authenticate_token() {
            await api.get('session/validatetoken', {
                  params: {
                        token: localStorage.getItem('token')
                  }
            })
                  .then((response) => {
                        return true
                  })
                  .catch((err) => {
                        // notify(`${err.response === undefined ? err.message : err.response.data.message}`, '⚠️', 'error', 'top-right');
                        return false
                  });

      };

      if (localStorage.hasOwnProperty('token')) {
            if (localStorage.getItem('token').length <= 100) {
                  return false
            }
            return authenticate_token();
      } else {
            return false;
      };
};