const mongoose = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../src/server');
const Queue = require('../../src/app/services/Queue');

const Meetup = mongoose.model('Meetup');

const factory = require('../factories');
const truncate = require('../utils/truncate');
const { expect } = chai;

chai.use(chaiHttp);

describe('Subscription Controller', () => {
  beforeEach(async () => {
    await truncate();
  });

  describe('Store', () => {
    it('should be able to subscribe a user and notificate by email', async () => {
      const meetup = await factory.create('Meetup');

      await Meetup.populate(meetup, 'user');

      const token = meetup.user.generateToken();

      const sendMail = sinon.spy(Queue, 'create');

      const response = await chai.request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          meetup_id: meetup.id,
        });

      Queue.create.restore();

      expect(response.status).to.be.eq(200);
      expect(response.body.subscriptions).to.contains(meetup.user.id);
      expect(sendMail.calledOnce).to.be.eq(true);
    });

    it('should not be able to subscribe a user already subscribed', async () => {
      const meetup = await factory.create('Meetup');

      await Meetup.update(
        {
          _id: meetup.id,
        },
        { $push: { subscriptions: meetup.user } },
      );

      await Meetup.populate(meetup, 'user');

      const token = meetup.user.generateToken();

      const sendMail = sinon.spy(Queue, 'create');

      const response = await chai.request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          meetup_id: meetup.id,
        });

      Queue.create.restore();

      expect(response.status).to.be.eq(200);
      expect(sendMail.notCalled).to.be.eq(true);
    });
  });

  it('should return validation error when no data was sent', async () => {
    const user = await factory.create('User');
    const token = user.generateToken();

    const response = await chai.request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).to.be.eq(422);
    expect(response.body).to.have.property('errors');
  });
});
