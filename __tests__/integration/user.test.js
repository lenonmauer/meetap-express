const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../src/server');
const factory = require('../factories');

const { expect } = chai;
const User = mongoose.model('User');

chai.use(chaiHttp);

describe('User Controller', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  describe('Store', () => {
    it('should be able to create a new user', async () => {
      const data = await factory.attrs('User');

      const response = await chai.request(app)
        .post('/users')
        .send({
          ...data,
          password_confirmation: data.password,
        });

      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.property('_id');
    });

    it('should not be able to create a new user with a duplicate email', async () => {
      const data = await factory.attrs('User');

      await factory.create('User', { email: data.email });

      const response = await chai.request(app)
        .post('/users')
        .send({
          ...data,
          password_confirmation: data.password,
        });

      expect(response.status).to.be.eq(400);
      expect(response.body).to.have.property('error');
    });

    it('should not be able to create when password is not confirmed', async () => {
      const data = await factory.attrs('User');

      const response = await chai.request(app)
        .post('/users')
        .send(data);

      expect(response.status).to.be.eq(422);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].param).to.be.eq('password_confirmation');
    });
  });

  describe('Show', () => {
    it('should be able to return user profile data', async () => {
      const user = await factory.create('User');
      const token = user.generateToken();

      const response = await chai.request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).to.be.eq(200);
      expect(response.body.name).to.be.eq(user.name);
      expect(response.body).to.have.property('categories');
    });
  });

  describe('Update', () => {
    it('should be able to update a user', async () => {
      const data = await factory.attrs('UserWithCategories');
      const user = await factory.create('User');
      const token = user.generateToken();

      const response = await chai.request(app)
        .put('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...data,
          password_confirmation: data.password,
          categories: ['dev-ops'],
        });

      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.property('name');
      expect(response.body.name).to.be.eq(data.name);
      expect(response.body.categories.length).to.be.eq(1);
      expect(response.body.categories[0]).to.be.eq('dev-ops');
    });

    it('should not be able to update a user when validation fails', async () => {
      const data = await factory.attrs('User');
      const user = await factory.create('User');
      const token = user.generateToken();

      const response = await chai.request(app)
        .put('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(response.status).to.be.eq(422);
      expect(response.body).to.have.property('errors');
      expect(response.body.errors[0].param).to.be.eq('password_confirmation');
      expect(response.body.errors[1].param).to.be.eq('categories');
    });
  });
});
