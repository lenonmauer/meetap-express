const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../src/server');

const factory = require('../factories');
const truncate = require('../utils/truncate');
const { expect } = chai;

chai.use(chaiHttp);

describe('Session Controller', () => {
  beforeEach(async () => {
    await truncate();
  });

  describe('Store', () => {
    it('should return the JWT token and first_login info if email and password are valid', async () => {
      const password = '123123';
      const user = await factory.create('User', { password });

      const response = await chai.request(app)
        .post('/login')
        .send({
          email: user.email,
          password,
        });

      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('first_login');
    });

    it('should return error if email doesnt exists', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send({
          email: 'aaaaa@gmail.com',
          password: '123123',
        });

      expect(response.status).to.be.eq(400);
      expect(response.body).to.have.property('error');
    });

    it('should return error if password is invalid', async () => {
      const user = await factory.create('User', { password: '123123' });

      const response = await chai.request(app)
        .post('/login')
        .send({
          email: user.email,
          password: '1231232',
        });

      expect(response.status).to.be.eq(400);
      expect(response.body).to.have.property('error');
    });

    it('should return validation error if no data has sent', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send();

      expect(response.status).to.be.eq(422);
      expect(response.body).to.have.property('errors');
    });
  });
});
