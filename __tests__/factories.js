const mongoose = require('mongoose');
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

/*
factory.define('Ad', mongoose.model('Ad'), {
  title: faker.name.title(),
  description: faker.lorem.paragraph,
  author: factory.assoc('User', '_id'),
  purchasedBy: factory.assoc('User', '_id'),
  price: faker.random.number,
});
*/

module.exports = factory;
