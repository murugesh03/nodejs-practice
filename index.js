require('dotenv').config();
const debug = require('debug')('app:startup');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const express = require('express');
const { Schema } = require('mongoose');
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authenticate');
const courses = require('./routes/courses');
const home = require('./routes/home');
const app = express();

app.set('view engine', 'pug');

app.set('views', './views'); // default

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(logger);

app.use(helmet());

app.use('/', home);
app.use('/api/courses', courses);

//Configuration
console.log(`Application Name : ${config.get('name')}`);
console.log(`Mail Server : ${config.get('mail.host')}`);
console.log(`Mail Password : ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan is running..');
}

app.use(authenticate);

// app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 2000;
// var bodyParser = require('body-parser');
// app.use(bodyParser)

app.listen(port, () => console.log(`server is running ${port}`));
