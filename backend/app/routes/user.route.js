const controller = require('../controllers/user.controller.js');
const auth = require('../middleware/auth.js');

module.exports = (app) => {
  const router = require('express').Router();

  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.get('/me', auth, controller.me);
  router.post('/logout', auth, controller.logout);

  app.use('/api/auth', router);
};
