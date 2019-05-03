const express = require('express');
const handle = require('express-async-handler');
const multer = require('multer');

const upload = multer(require('./config/multer'));
const validations = require('./app/validations');
const { auth: authMiddleware, validation: validationMiddleware } = require('./app/middlewares');

const routes = express.Router();

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

routes.post('/login', validationMiddleware(validations.session), handle(SessionController.store));

routes.post('/users', validationMiddleware(validations.user.store), handle(UserController.store));
routes.put('/users', authMiddleware, validationMiddleware(validations.user.update), handle(UserController.update));
routes.get('/profile', authMiddleware, handle(UserController.show));

routes.get('/categories', handle(CategoryController.index));

routes.post('/upload', upload.single('photo'), handle(FileController.store));

routes.put(
  '/user-categories',
  authMiddleware,
  validationMiddleware(validations['user-category']),
  handle(UserCategoryController.update)
);

routes.get('/meetups', authMiddleware, handle(MeetupController.index));
routes.get('/meetups/:id', authMiddleware, handle(MeetupController.show));
routes.post('/meetups', authMiddleware, validationMiddleware(validations.meetup), handle(MeetupController.store));

routes.post(
  '/subscriptions',
  authMiddleware,
  validationMiddleware(validations.subscription),
  handle(SubscriptionController.store)
);

module.exports = routes;
