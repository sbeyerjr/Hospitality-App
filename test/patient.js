'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const expect = chai.expect;
const User = require('../models/user');
const { Patient } = require('../models/patient');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const testUser = require('../db/seed/users')[0];
chai.use(chaiHttp);

function seedPatientData() {
  console.info('seeding patient data');
  const seedData = [];

  for (let i = 1; i <= 10; i++) {
    seedData.push(generatePatientData());
  }
  // this will return a promise
  return Patient.insertMany(seedData);
}

function generatePatientData() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    roomNumber: faker.random.number(),
    wantsVisitors: faker.random.boolean(),
    notes: faker.random.words()
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Patients API resource', function() {
  let user;
  let token;
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return User.create(testUser).then(_user => {
      user = _user;
      token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });

      return Promise.all([seedPatientData()]);
    });
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {
    it('should return all existing patients', function() {
      let res;
      return chai
        .request(app)
        .get('/patients')
        .set('Authorization', `Bearer ${token}`)
        .then(function(_res) {
          res = _res;
          console.log(res.body);
          expect(res).to.have.status(200);
        });
    });

    it('should return patients with right fields', function() {
      // Strategy: Get back all patients, and ensure they have expected keys

      let resPatient;
      return chai
        .request(app)
        .get('/patients')
        .set('Authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          res.body.forEach(function(patient) {
            expect(patient).to.be.a('object');
            expect(patient).to.include.keys(
              'id',
              'firstName',
              'lastName',
              'roomNumber',
              'wantsVisitors',
              'notes'
            );
          });
          resPatient = res.body[0];
        });
    });
  });
  describe('POST endpoint', function() {
    it('should add a new patient', function() {
      const newPatient = generatePatientData();

      return chai
        .request(app)
        .post('/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(newPatient);
    });
  });
  describe('PUT endpoint', function() {
    it('should update fields you send over', function() {
      const updateData = {
        firstName: 'John',
        lastName: 'Smith',
        roomNumber: '111',
        wantsVisitors: true,
        notes: 'Test Notes'
      };

      return Patient.findOne()
        .then(function(patient) {
          updateData.id = patient.id;
          return chai
            .request(app)
            .put(`/patients/${patient.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Patient.findById(updateData.id);
        })
        .then(function(patient) {
          expect(patient.firstName).to.equal(updateData.firstName);
          expect(patient.lastName).to.equal(updateData.lastName);
          expect(patient.roomNumber).to.equal(updateData.roomNumber);
          expect(patient.wantsVisitors).to.equal(updateData.wantsVisitors);
          expect(patient.notes).to.equal(updateData.notes);
        });
    });
  });

  describe('DELETE endpoint', function() {
    it('delete a patient by id', function() {
      let patient;

      return Patient.findOne()
        .then(function(_patient) {
          patient = _patient;
          return chai
            .request(app)
            .delete(`/patients/${patient.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Patient.findById(patient.id);
        })
        .then(function(_patient) {
          expect(_patient).to.be.null;
        });
    });
  });
});
