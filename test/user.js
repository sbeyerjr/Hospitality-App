'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const app = express();
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const User = require('../models/user');
const { runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedUserData() {
  console.info('seeding user data');
  const seedData = [];

  for (let i = 1; i <= 10; i++) {
    seedData.push(generateUserData());
  }
  // this will return a promise
  return User.insertMany(seedData);
}

function generateUserData() {
  return {
    fullName: faker.name.firstName(),
    username: 'anewuser',
    password: 'password123'
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Users API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  describe('POST endpoint', function() {
    it('should add a new user', function() {
      const newUser = generateUserData();

      return chai
        .request(app)
        .post('/users')
        .send(newUser);
    });
  });
});
