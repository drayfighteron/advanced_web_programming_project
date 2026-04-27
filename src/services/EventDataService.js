import http from '../http-common';

class EventDataService {
  getAll(status = 'all') {
    return http.get('/events', { params: { status } });
  }

  getActive() {
    return http.get('/events/active');
  }

  getPast() {
    return http.get('/events/past');
  }

  create(data) {
    return http.post('/events', data);
  }

  update(id, data) {
    return http.put(`/events/${id}`, data);
  }

  delete(id) {
    return http.delete(`/events/${id}`);
  }
}

export default new EventDataService();
