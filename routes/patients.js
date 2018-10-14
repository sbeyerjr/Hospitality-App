const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Patient } = require('../models/patient');

router.get('/', (req, res) => {
  Patient.find({ userId: req.user._id })
    .then(patients => {
      res.json(patients.map(patient => patient.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', jsonParser, (req, res) => {
  console.log(req.body);
  const requiredFields = ['firstName', 'lastName'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\`. Please put in the required field(s).`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  return Patient.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    roomNumber: req.body.roomNumber,
    wantsVisitors: req.body.wantsVisitors,
    notes: req.body.notes,
    hospital: req.body.hospital,
    userId: req.user._id
  })

    .then(patient => {
      console.log(patient);
      res.status(201).json(patient.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.put('/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = [
    'firstName',
    'lastName',
    'roomNumber',
    'notes',
    'wantsVisitors',
    'hospital'
  ];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Patient.findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(() => res.status(204).end())
    .catch(() => res.status(500).json({ message: 'Internal Server Error' }));
});

router.delete('/:id', (req, res) => {
  Patient.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(() => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;
