const kue = require('kue');
const Sentry = require('@sentry/node');
const redisConfig = require('../../config/redis');
const jobs = require('../jobs');

const Queue = kue.createQueue({ redis: redisConfig });

Queue.process(jobs.NewSubscriptionMail.key, jobs.NewSubscriptionMail.handle);

if (process.env.NODE_ENV === 'development') {
  Queue.on('error', (error) => {
    console.log(error);
  });
}
else {
  Queue.on('error', Sentry.captureException);
}

module.exports = Queue;
