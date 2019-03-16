const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../src/server');

const factory = require('../factories');
const truncate = require('../utils/truncate');
const { expect } = chai;

chai.use(chaiHttp);

describe('UserCategory Controller', () => {
  beforeEach(async () => {
    await truncate();
  });

  describe('Update', () => {
    it('should be able to update user categories', async () => {
      const user = await factory.create('User');
      const token = user.generateToken();
      const categories = [
        'front-end',
        'back-end',
      ];

      const response = await chai.request(app)
        .put('/api/user-categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ categories });

      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('categories');
    });

    it('should return validation errors when no data was sent', async () => {
      const user = await factory.create('User');
      const token = user.generateToken();

      const response = await chai.request(app)
        .put('/api/user-categories')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).to.be.eq(422);
    });
  });
});
