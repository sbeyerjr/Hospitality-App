const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Hospital } = require('../models/hospital');
const passport = require('passport');

router.get('/', (req, res) => {
  console.log(req.user);
  Hospital.find()
    .then(hospitals => {
      console.log(hospitals);
      res.json(hospitals.map(hospital => hospital.serialize()));
    })

    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});
router.post('/', jsonParser, (req, res) => {
  console.log(req.body);
  const requiredFields = ['name', 'location'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\`. Please put in the required field(s).`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  return Hospital.create({
    name: req.body.name,
    location: req.body.location
  })

    .then(hospital => {
      console.log(hospital);
      res.status(201).json(hospital.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.put('/:id', jsonParser, (req, res) => {
  console.log(req);
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['name', 'location', 'id'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Hospital.findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(hospital => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});
router.delete('/:id', (req, res) => {
  Hospital.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;
