const controller = require('../controllers/event.controller.js');
const auth = require('../middleware/auth.js');

module.exports = (app) => {
  const router = require('express').Router();

  router.get('/', controller.getEvents);
  router.get('/active', controller.getActiveEvents);
  router.get('/past', controller.getPastEvents);
  router.post('/', controller.createEvent);
  router.put('/:id', controller.updateEvent);
  router.delete('/:id', controller.deleteEvent);

  app.use('/api/events', auth, router);
};
