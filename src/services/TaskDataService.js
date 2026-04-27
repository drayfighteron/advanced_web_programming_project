import http from '../http-common';

class TaskDataService {
  getAll() {
    return http.get('/tasks');
  }

  getByEvent(eventId) {
    return http.get(`/tasks/${eventId}`);
  }

  create(eventId, data) {
    return http.post(`/tasks/${eventId}`, data);
  }

  update(taskId, data) {
    return http.put(`/tasks/${taskId}`, data);
  }

  reorder(data) {
    return http.put('/tasks/reorder', data);
  }

  delete(taskId) {
    return http.delete(`/tasks/${taskId}`);
  }
}

export default new TaskDataService();
