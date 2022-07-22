const express = require('express');
const router = express.Router();
const Joi = require('joi');

const courses = [
  { id: 1, name: 'Node js' },
  { id: 2, name: 'React js' }
];

router.get('/', (req, res) => {
  res.send(courses);
});

router.get('/:id', (req, res) => {
  const matchCourse = courses.find((c) => c.id === parseInt(req.params.id));
  if (!matchCourse) res.status(404).send('The course is not found');
  res.send(matchCourse);
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

module.exports = router;
