const Mail = require('../services/Mail');

class NewSubscriptionMail {
  get key () {
    return 'NewSubscriptionMail';
  }

  async handle (jobs, done) {
    const { title, email, name, date } = jobs.data;

    await Mail.sendMail({
      from: '"Meetapp" <meetapp@meetapp.com>',
      to: email,
      subject: 'Inscrição no meetup',
      template: 'new-subscription',
      context: { title, name, date },
    });

    done();
  }
}

module.exports = new NewSubscriptionMail();
