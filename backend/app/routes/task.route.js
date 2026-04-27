const controller = require('../controllers/task.controller.js');
const auth = require('../middleware/auth.js');

module.exports = (app) => {
  const router = require('express').Router();

  router.get('/', controller.getTasksForUser);
  router.get('/:eventId', controller.getTasksByEvent);
  router.post('/:eventId', controller.createTask);
  router.put('/reorder', controller.reorderTasks);
  router.put('/:taskId', controller.updateTask);
  router.delete('/:taskId', controller.deleteTask);

  app.use('/api/tasks', auth, router);
};
