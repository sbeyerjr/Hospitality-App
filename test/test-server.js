"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');
const mongoose = require('mongoose');

const {Hospital} = require('../models');
const {Patient} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');


const expect = chai.expect;

chai.use(chaiHttp);

function seedHospitalData() {
    console.info('Seeding Hospital Info');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateHospitalData());
    }
    return Hospital.insertMany(seedData);
}

function generateHospitalData() {
    return {
        name: faker.company.companyName(),
        location: faker.address.streetAddress(),
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
  }

  describe('Hospitals API resource', function() {

    // we need each of these hook functions to return a promise
    // otherwise we'd need to call a `done` callback. `runServer`,
    // `seedRestaurantData` and `tearDownDb` each return a promise,
    // so we return the value returned by these function calls.
    before(function() {
      return runServer(TEST_DATABASE_URL);
    });
  
    beforeEach(function() {
      return seedHospitalData();
    });
  
    afterEach(function() {
      return tearDownDb();
    });
  
    after(function() {
      return closeServer();
    });
  
    describe('GET endpoint', function() {
  
      it('should return all existing hospitals', function() {
        let res;
        return chai.request(app)
          .get('/hospitals')
          .then(function(_res) {
            res = _res;
            expect(res).to.have.status(200);
            // otherwise our db seeding didn't work
            expect(res.body.hospitals).to.have.lengthOf.at.least(1);
            return Hospital.count();
          })
          .then(function(count) {
            expect(res.body.hospitals).to.have.lengthOf(count);
          });
      });
  
  
      it('should return hospitals with right fields', function() {
        // Strategy: Get back all hospitals, and ensure they have expected keys
  
        let resHospital;
        return chai.request(app)
          .get('/hospitals')
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.hospitals).to.be.a('array');
            expect(res.body.hospitals).to.have.lengthOf.at.least(1);
  
            res.body.hospitals.forEach(function(hospital) {
              expect(hospital).to.be.a('object');
              expect(hospital).to.include.keys(
                'id', 'name', 'location');
            });
            resHospital = res.body.hospitals[0];
            return Hospital.findById(resHospital.id);
          })
          .then(function(hospital) {
  
            expect(resHospital.id).to.equal(hospital.id);
            expect(resHospital.name).to.equal(hospital.name);
          });
      });
    });
    it('should add a new hospital', function() {

      const newHospital = generateHospitalData();
      let mostRecentHospital;

      return chai.request(app)
        .post('/hospitals')
        .send(newHospital)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'name', 'location');
          expect(res.body.name).to.equal(newHospital.name);
          expect(res.body.location).to.equal(newHospital.location);
            return res.body;
        })
        .then(function(hospital) {
          expect(hospital.name).to.equal(newHospital.name);
          expect(hospital.location).to.equal(newHospital.location);
        });
    });
    it('should update fields you send over', function() {
      const updateData = {
        name: 'Honor Health',
        location: '123 Main Street'
      };

      return Hospital
        .findOne()
        .then(function(hospital) {
          updateData.id = hospital.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/hospitals/${hospital.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Hospital.findById(updateData.id);
        })
        .then(function(hospital) {
          expect(hospital.name).to.equal(updateData.name);
          expect(hospital.location).to.equal(updateData.location);
        });
    });
    it('delete a hospital by id', function() {

      let hospital;

      return Hospital
        .findOne()
        .then(function(_hospital) {
          hospital = _hospital;
          return chai.request(app).delete(`/hospitals/${hospital.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Hospital.findById(hospital.id);
        })
        .then(function(_hospital) {
          expect(_hospital).to.be.null;
        });
    });
  });

  function seedPatientData() {
    console.info('Seeding Patient Info');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generatePatientData());
    }
    return Patient.insertMany(seedData);
}

function generatePatientData() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        roomNumber: faker.random.number(),
        wantsVisitors: faker.random.boolean(),
        notes: faker.random.words()
    }
}

  describe('Patients API Resource', function() {

    before(function() {
      return runServer(TEST_DATABASE_URL);
    });
  
    beforeEach(function() {
      return seedPatientData();
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
        return chai.request(app)
          .get('/patients')
          .then(function(_res) {
            res = _res;
            expect(res).to.have.status(200);
            // otherwise our db seeding didn't work
            expect(res.body.patients).to.have.lengthOf.at.least(1);
            return Patient.count();
          })
          .then(function(count) {
            expect(res.body.patients).to.have.lengthOf(count);
          });
      });
  
  
      it('should return patients with right fields', function() {
        // Strategy: Get back all patients, and ensure they have expected keys
  
        let resPatient;
        return chai.request(app)
          .get('/patients')
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.patients).to.be.a('array');
            expect(res.body.patients).to.have.lengthOf.at.least(1);
  
            res.body.patients.forEach(function(patient) {
              expect(patient).to.be.a('object');
              expect(patient).to.include.keys(
                'id', 'firstName', 'lastName', 'roomNumber', 'wantsVisitors', 'notes');
            });
            resPatient = res.body.patients[0];
            return Patient.findById(resPatient.id);
          })
          .then(function(patient) {
  
            expect(resPatient.id).to.equal(patient.id);
            expect(resPatient.name).to.equal(patient.name);
          });
      });
    });
  
  });

 
describe("index page", function() {
  it("should exist", function() {
    return chai
      .request(app)
      .get("/")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});

describe("../dashboard.html", function() {
    it("should exist", function() {
      return chai
        .request(app)
        .get("/")
        .then(function(res) {
          expect(res).to.have.status(200);
        });
    });
  });

