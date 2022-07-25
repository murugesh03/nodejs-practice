require('dotenv').config();
const debug = require('debug')('app:startup');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authenticate');
const courses = require('./routes/courses');
const home = require('./routes/home');
const app = express();

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => debug('Mongodb is connected..'))
  .catch((error) => debug('Could not connect mongodb..', error));

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'React Course',
    author: 'kishan kumar',
    tags: ['react', 'frontend'],
    isPublished: true
  });
  const result = await course.save();
  debug(result, 'result');
}

// createCourse();

//Comparison Operator

//eq -  equal
//ne -  not equal
//gt - greater than
//gte - greater than or equal to
//lt - less than
//lte - less than or equal to
//in - exact range
// nin - not in

//Logical Operator

//or
//and

// Regular Expression Query

//Start with name - '^' indicates filter all the name starts with given name
//.find({author: /^Mosh/})

//End with name -
//'$' indicates the filter all the name end with given name
// 'i' - indicates the case sensitive
//.find({author: /Hamedani$/i})

//Contains name
//.* - indicate the all the name contains with given name
// 'i' - indicates the case sensitive
//.find({author: /.*Mosh.*/})

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({
    author: 'kishan kumar',
    isPublished: true
  })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 })
    .count();
  // .select({ name: 1, tags: 1 });
  debug(courses);
}

getCourses();

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
