const mongoose = require('mongoose');
const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../src/server');
const factory = require('../factories');

const File = mongoose.model('File');

const { expect } = chai;

chai.use(chaiHttp);

describe('File Controller', () => {
  beforeEach(async () => {
    await File.deleteMany();
  });

  describe('Store', () => {
    it('should store a new file', async () => {
      const filepath = path.resolve(__dirname, '..', 'utils', 'upload', 'image.jpg');

      const response = await chai.request(app)
        .post('/upload')
        .attach('photo', filepath);

      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.property('_id');
    });

    it('should not store a file if it is not a image', async () => {
      const filepath = path.resolve(__dirname, '..', 'utils', 'upload', 'text.txt');

      const response = await chai.request(app)
        .post('/upload')
        .attach('photo', filepath);

      expect(response.status).to.be.eq(400);
    });

    it('should return error if file has sent', async () => {
      const response = await chai.request(app)
        .post('/upload')
        .send();

      expect(response.status).to.be.eq(400);
    });
  });

  describe('Show', () => {
    it('should render the file', async () => {
      const file = await factory.create('File');

      const response = await chai.request(app)
        .get(`/file/${file.id}`)
        .send();

      expect(response.status).to.be.eq(200);
    });
  });
});
