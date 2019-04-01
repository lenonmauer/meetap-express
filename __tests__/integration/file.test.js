const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../src/server');

const truncate = require('../utils/truncate');
const { expect } = chai;

chai.use(chaiHttp);

describe('File Controller', () => {
  beforeEach(async () => {
    await truncate();
  });

  describe('Store', () => {
    it('should store a new file', async () => {
      const filepath = path.resolve(__dirname, '..', 'utils', 'upload', 'image.jpg');

      const response = await chai.request(app)
        .post('/api/upload')
        .attach('photo', filepath);

      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.property('_id');
    });

    it('should not store a file if it is not a image', async () => {
      const filepath = path.resolve(__dirname, '..', 'utils', 'upload', 'text.txt');

      const response = await chai.request(app)
        .post('/api/upload')
        .attach('photo', filepath);

      expect(response.status).to.be.eq(400);
    });

    it('should return error if file has sent', async () => {
      const response = await chai.request(app)
        .post('/api/upload')
        .send();

      expect(response.status).to.be.eq(400);
    });
  });
});
