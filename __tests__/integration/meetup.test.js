const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

const app = require('../../src/server');

const Meetup = mongoose.model('Meetup');

const factory = require('../factories');
const truncate = require('../utils/truncate');
const { expect } = chai;

chai.use(chaiHttp);

describe('Meetup Controller', () => {
  beforeEach(async () => {
    await truncate();
  });

  describe('Index', async () => {
    it('should be able to return correct meetups that user was subscript', async () => {
      const user = await factory.create('User');

      const dateLowerThanNow = moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm');
      const meetup1 = await factory.create('Meetup');
      const meetup2 = await factory.create('Meetup');
      const meetup3 = await factory.create('Meetup', { date: dateLowerThanNow });

      await factory.createMany('Meetup', 2);

      await Meetup.updateMany(
        { _id: [meetup1.id, meetup2.id, meetup3.id] },
        { $push: { subscriptions: user } }
      );

      const token = user.generateToken();

      const response = await chai.request(app)
        .get('/api/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).to.be.eq(200);
      expect(response.body.subscriptions.length).to.be.eq(2);
    });

    it('should be able to return correct next meetups', async () => {
      const user = await factory.create('User');
      const token = user.generateToken();
      const dateLowerThanNow = moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm');

      const [meetup] = await factory.createMany('Meetup', 4);

      await factory.create('Meetup', { date: dateLowerThanNow });

      await Meetup.update(
        { _id: meetup.id },
        { $push: { subscriptions: user } }
      );

      const response = await chai.request(app)
        .get('/api/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).to.be.eq(200);
      expect(response.body.next.length).to.be.eq(3);
    });

    it('should be able to return correct recommended meetups', async () => {
      const user = await factory.create('User', { categories: ['front-end', 'dev-ops'] });
      const token = user.generateToken();
      const dateLowerThanNow = moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm');

      const meetup = await factory.create('Meetup', { categories: ['dev-ops'] });

      await factory.create('Meetup', { categories: ['front-end'] });
      await factory.create('Meetup', { categories: ['back-end', 'front-end'] });
      await factory.create('Meetup', { categories: ['dev-ops'] });
      await factory.create('Meetup', { categories: ['back-end'] });
      await factory.create('Meetup', { date: dateLowerThanNow, categories: ['front-end'] });

      await Meetup.update(
        { _id: meetup.id },
        { $push: { subscriptions: user } }
      );

      const response = await chai.request(app)
        .get('/api/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).to.be.eq(200);
      expect(response.body.recommended.length).to.be.eq(3);
    });

    it('should be able to filter meetups on search', async () => {
      const user = await factory.create('User', { categories: ['front-end', 'dev-ops'] });
      const token = user.generateToken();

      await factory.create('Meetup', { title: 'Meetup 1', categories: ['front-end'] });
      await factory.create('Meetup', { title: 'Meetup 2', categories: ['front-end'] });

      await factory.create('Meetup', { title: 'Meetup 1' });
      await factory.create('Meetup', { title: 'Meetup 2' });

      const meetup = await factory.create('Meetup', { title: 'Meetup 1' });
      const meetup2 = await factory.create('Meetup', { title: 'Meetup 2' });

      await Meetup.updateMany(
        { _id: [meetup.id, meetup2.id] },
        { $push: { subscriptions: user } }
      );

      const response = await chai.request(app)
        .get('/api/meetups?search=up 1')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).to.be.eq(200);
      expect(response.body.subscriptions.length).to.be.eq(1);
      expect(response.body.next.length).to.be.eq(2);
      expect(response.body.recommended.length).to.be.eq(1);
    });
  });

  describe('Show', async () => {
    it('should be able to show the meetup data', async () => {
      const meetup = await factory.create('Meetup');

      await Meetup.populate(meetup, 'user');

      const token = meetup.user.generateToken();

      const response = await chai.request(app)
        .get(`/api/meetups/${meetup.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          meetup_id: meetup.id,
        });

      expect(response.status).to.be.eq(200);
      expect(response.body.subscript).to.be.eq(false);
    });

    it('should be able to show the meetup data with user subscript', async () => {
      const meetup = await factory.create('Meetup');

      await Meetup.update(
        {
          _id: meetup.id,
        },
        { $push: { subscriptions: meetup.user } },
      );

      await Meetup.populate(meetup, 'user');

      const token = meetup.user.generateToken();

      const response = await chai.request(app)
        .get(`/api/meetups/${meetup.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          meetup_id: meetup.id,
        });

      expect(response.status).to.be.eq(200);
      expect(response.body.subscript).to.be.eq(true);
    });
  });

  describe('Store', async () => {
    it('should be able to create a new meetup', async () => {
      const user = await factory.create('User');
      const token = user.generateToken();
      const date = moment().add(1, 'day').format('DD/MM/YYYY HH:mm');
      const data = await factory.attrs('Meetup', { date, categories: ['back-end'] });

      const response = await chai.request(app)
        .post('/api/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.property('_id');
    });

    it('should return error when date is lower than today', async () => {
      const user = await factory.create('User');
      const token = user.generateToken();
      const lowerDate = moment().subtract(1, 'days').format('DD/MM/YYYY HH:mm');
      const data = await factory.attrs('Meetup', { date: lowerDate, categories: ['front-end'] });

      const response = await chai.request(app)
        .post('/api/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(response.status).to.be.eq(400);
      expect(response.body).to.have.property('error');
    });

    it('should return validation error when no data was sent', async () => {
      const user = await factory.create('User');
      const token = user.generateToken();

      const response = await chai.request(app)
        .post('/api/meetups')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).to.be.eq(422);
      expect(response.body).to.have.property('errors');
    });
  });
});
