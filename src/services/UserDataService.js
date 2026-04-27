import http from '../http-common';

class UserDataService {
  register(data) {
    return http.post('/auth/register', data);
  }

  login(data) {
    return http.post('/auth/login', data);
  }

  me() {
    return http.get('/auth/me');
  }

  logout() {
    return http.post('/auth/logout');
  }
}

export default new UserDataService();
