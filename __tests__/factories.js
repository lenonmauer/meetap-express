const mongoose = require('mongoose');
const moment = require('moment');
const path = require('path');
const factoryGirl = require('factory-girl');
const faker = require('faker');

const { factory } = factoryGirl;

factory.setAdapter(new factoryGirl.MongooseAdapter());

factory.define('User', mongoose.model('User'), {
  name: faker.name.findName(),
  email: factory.seq('User.email', n => `user_${n}@gmail.com`),
  password: faker.internet.password(),
});

factory.define('UserWithCategories', mongoose.model('User'), {
  name: faker.name.findName(),
  email: factory.seq('User.email', n => `user_${n}@gmail.com`),
  password: faker.internet.password(),
  categories: ['front-end', 'back-end'],
});

factory.define('File', mongoose.model('File'), {
  type: faker.system.mimeType(),
  name: faker.system.fileName(),
  path: path.resolve(__dirname, 'upload', 'image.jpg'),
});

factory.define('Meetup', mongoose.model('Meetup'), {
  title: faker.name.title(),
  description: faker.name.jobDescriptor(),
  photo_id: factory.assoc('File', '_id'),
  user: factory.assoc('User', '_id'),
  localization: faker.address.city(),
  date: moment().add(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm'),
  categories: ['front-end', 'back-end'],
});

module.exports = factory;
