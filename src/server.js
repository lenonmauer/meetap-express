const envPath = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV.trim()}`
  : '.env';

require('dotenv').config({ path: envPath });

const express = require('express');
const Sentry = require('@sentry/node');
const Youch = require('youch');
const mongoose = require('mongoose');
const mongoConfig = require('./config/database');
const sentryConfig = require('./config/sentry');
const routes = require('./routes');

class App {
  constructor () {
    this.express = express();
    this.isDev = process.env.NODE_ENV !== 'production';

    this.sentry();
    this.database();
    this.middlewares();
    this.routes();
    this.exception();
  }

  sentry () {
    Sentry.init({ dsn: sentryConfig.dns });
  }

  database () {
    mongoose.connect(mongoConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
  }

  middlewares () {
    this.express.use(express.json());
    this.express.use(Sentry.Handlers.requestHandler());
  }

  routes () {
    this.express.use(routes);
  }

  exception () {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler());
    }

    this.express.use(async (err, req, res) => {
      // if (err instanceof validate.ValidationError) {
      //  return res.status(err.status).json(err);
      // }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err);

        return res.status(err.status || 500).json(await youch.toJSON());
      }

      res.status(err.status || 500).json({ error: 'Internal Server Error' });
    });
  }
}

module.exports = new App().express;
