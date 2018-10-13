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
const should = chai.should();
chai.use(chaiHttp);

describe('Hospitals', function() {

    before(function() {
      return runServer();
    });
  
    after(function() {
      return closeServer();
    });
  
    it('should list hospitals on GET', function() {
      // recall that we manually add some recipes to `Recipes`
      // inside `recipesRouter.js`. Later in this course,
      // once we're using a database layer, we'll seed
      // our database with test data, and we can form our expectations
      // about what GET should return, based on what we know about
      // the state of our database.
      return chai.request(app)
        .get('/hospitals')
        .then(function(res) {
  
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
  
          res.body.should.have.length.of.at.least(1);
  
          // each item should be an object with key/value pairs
          // for `id`, `name` and `ingredients`.
          res.body.forEach(function(item) {
            item.should.be.a('object');
            item.should.include.keys('id', 'name', 'location');
          });
        });
    });
  });