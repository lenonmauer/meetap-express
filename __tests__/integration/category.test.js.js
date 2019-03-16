const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../src/server');

const { expect } = chai;

chai.use(chaiHttp);

describe('Category Controller', () => {
  describe('Index', () => {
    it('should return all categories', async () => {
      const response = await chai.request(app)
        .get('/api/categories')
        .send();

      expect(response.status).to.be.eq(200);
      expect(response.body.length).to.be.eq(6);
      expect(response.body[0]).to.have.property('id');
      expect(response.body.length).to.have.property('name');
    });
});
