'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const {Hospital} = require('../models/hospital');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedHospitalData() {
  console.info('seeding hospital data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateHospitalData());
  }
  // this will return a promise
  return Hospital.insertMany(seedData);
}



// generate an object represnting a hospital.
// can be used to generate seed data for db
// or request.body data
function generateHospitalData() {
  return {
    name: faker.company.companyName(),
    location: faker.address.streetAddress(),
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
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(1);
          return Hospital.count();
        })
        .then(function(count) {
          expect(res.body).to.have.lengthOf(count);
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
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);

          res.body.forEach(function(hospital) {
            expect(hospital).to.be.a('object');
            expect(hospital).to.include.keys(
              'id', 'name', 'location');
          });
          resHospital = res.body[0];
          return Hospital.findById(resHospital.id);
        })
        .then(function(hospital) {

          expect(resHospital.id).to.equal(hospital.id);
          expect(resHospital.name).to.equal(hospital.name);
          expect(resHospital.location).to.equal(hospital.location);
          
        });
    });
  });
  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the restaurant we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new restaurant', function() {

      const newHospital = generateHospitalData();
     

      return chai.request(app)
        .post('/hospitals')
        .send(newHospital);
        
    });
  });
});