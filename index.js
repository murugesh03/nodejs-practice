require('dotenv').config();
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const express = require('express');
const { Schema } = require('mongoose');
const logger = require('./logger');
const authenticate = require('./authenticate');
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(logger);

app.use(helmet());

//Configuration
console.log(`Application Name : ${config.get('name')}`);
console.log(`Mail Server : ${config.get('mail.host')}`);
console.log(`Mail Password : ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('Morgan is running..');
}
dbDebugger('Db connected');
app.use(authenticate);

// app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 2000;
// var bodyParser = require('body-parser');
// app.use(bodyParser)

const courses = [
  { id: 1, name: 'Node js' },
  { id: 2, name: 'React js' }
];

app.get('/', (req, res) => {
  res.send('Hellow World!');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const matchCourse = courses.find((c) => c.id === parseInt(req.params.id));
  if (!matchCourse) res.status(404).send('The course is not found');
  res.send(matchCourse);
});

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  console.log(req.body, 'this is request');
  const course = { id: courses.length + 1, name: req.body.name };
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  const copiedValue = [...courses];
  const matchCourse = copiedValue.find((c) => c.id === parseInt(req.params.id));
  if (!matchCourse) res.status(404).send('The course is not found');

  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  matchCourse.name = req.body.name;
  console.log(courses);
  console.log(copiedValue);
  res.send(matchCourse);
});

function validateCourse(course) {
  const scheme = Joi.object({
    name: Joi.string().min(3).required()
  });
  return scheme.validate(course);
}
app.listen(port, () => console.log(`server is running ${port}`));
