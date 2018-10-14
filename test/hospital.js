'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const { Hospital } = require('../models/hospital');
const { app, runServer, closeServer } = require('../server');
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
      return chai
        .request(app)
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
      return chai
        .request(app)
        .get('/hospitals')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);

          res.body.forEach(function(hospital) {
            expect(hospital).to.be.a('object');
            expect(hospital).to.include.keys('id', 'name', 'location');
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
    it('should add a new hospital', function() {
      const newHospital = generateHospitalData();

      return chai
        .request(app)
        .post('/hospitals')
        .send(newHospital);
    });
  });
  describe('PUT endpoint', function() {
    it('should update fields you send over', function() {
      const updateData = {
        name: 'New Hospital',
        location: '113 Main St'
      };

      return Hospital.findOne()
        .then(function(hospital) {
          updateData.id = hospital.id;
          return chai
            .request(app)
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
  });

  describe('DELETE endpoint', function() {
    it('delete a hospital by id', function() {
      let hospital;

      return Hospital.findOne()
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
});
