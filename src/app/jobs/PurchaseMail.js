const Mail = require('../services/Mail');

class PurchaseMail {
  get key () {
    return 'PurchaseMail';
  }

  async handle (jobs, done) {
    const { ad, user, content } = jobs.data;

    await Mail.sendMail({
      from: '"Lenon Mauer" <lenonmauer@gmail.com>',
      to: ad.author.email,
      subject: `Solicitação de compra ${ad.title}`,
      template: 'purchase',
      context: { user, content, ad },
    });

    done();
  }
}

module.exports = new PurchaseMail();
