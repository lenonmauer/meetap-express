const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.model('User').deleteMany();
  await mongoose.model('File').deleteMany();
  await mongoose.model('Meetup').deleteMany();
};
