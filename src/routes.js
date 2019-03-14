const express = require('express');
const handle = require('express-async-handler');
const multer = require('multer');

const upload = multer(require('./config/multer'));
const routes = express.Router();

const validations = require('./app/validations');

const { auth: authMiddleware, 'not-found': notFoundMiddleware } = require('./app/middlewares');

const {
  UserController,
  SessionController,
  CategoryController,
  FileController,
  UserCategoryController,
  MeetupController,
  SubscriptionController,
} = require('./app/controllers');

routes.get('/', (req, res) => res.send('hi'));

routes.post('/login', validations.session, handle(SessionController.store));

routes.post('/users', validations.user.store, handle(UserController.store));
routes.put('/users', authMiddleware, validations.user.update, handle(UserController.update));
routes.get('/profile', authMiddleware, handle(UserController.show));

routes.get('/categories', handle(CategoryController.index));

routes.get('/files/:id', handle(FileController.show));
routes.post('/upload', upload.single('photo'), handle(FileController.store));

routes.put('/user-categories', authMiddleware, validations['user-category'], handle(UserCategoryController.update));

routes.get('/meetups', authMiddleware, handle(MeetupController.index));
routes.get('/meetups/:id', authMiddleware, handle(MeetupController.show));
routes.post('/meetups', authMiddleware, validations.meetup, handle(MeetupController.store));

routes.post('/subscriptions', authMiddleware, validations.subscription, handle(SubscriptionController.store));

routes.use(notFoundMiddleware);

module.exports = routes;
