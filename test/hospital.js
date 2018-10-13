'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const { Hospital } = require('../models/hospital');
const app = require('../server');
const runServer = require('../server');
const closeServer = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedHospitalData() {
  console.info('seeding hospital data');
  const seedData = [];

  for (let i = 1; i <= 10; i++) {
    seedData.push(generateHospitalData());
  }
  // this will return a promise
  return Hospital.insertMany(seedData);
}

function generateHospitalData() {
  return {
    name: faker.company.companyName(),

    location: faker.address.streetAddress()
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Hospitals API resource', function() {
  // we need each of these hook functions to return a promise
  // otherwise we'd need to call a `done` callback. `runServer`,
  // `seedHospitalData` and `tearDownDb` each return a promise,
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

  // note the use of nested `describe` blocks.
  // this allows us to make clearer, more discrete tests that focus
  // on proving something small
  describe('GET endpoint', function() {

    it('should return all existing hospitals', function() {
      // strategy:
      //    1. get back all hospitals returned by by GET request to `/hospitals`
      //    2. prove res has right status, data type
      //    3. prove the number of hospitals we got back is equal to number
      //       in db.
      //
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
        .get('/hospitals')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
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
          expect(resHospital.location).to.equal(hospital.location);
         
        });
    });
  });
});
