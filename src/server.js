const envPath = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV.trim()}`
  : '.env';

require('dotenv').config({ path: envPath });

const express = require('express');
const Sentry = require('@sentry/node');
const Youch = require('youch');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

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
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(Sentry.Handlers.requestHandler());
  }

  routes () {
    const handle = require('express-async-handler');
    const { validationResult } = require('express-validator/check');
    const validations = require('./app/validations');

    this.express.post('/hi', validations.session, (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      res.send('hi');
    });

    this.express.use(routes);
  }

  exception () {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler());
    }

    this.express.use(async (err, req, res) => {
      if (err.status === 400 || err.status === 422) {
        return res.status(err.status).json(err);
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err);

        return res.status(err.status || 500).json(await youch.toJSON());
      }

      res.status(err.status || 500).json({ error: 'Internal Server Error' });
    });
  }
}

module.exports = new App().express;
