'use strict';

const mongoose = require('mongoose');

const { TEST_DATABASE_URL } = require('../config');

function connect(url = TEST_DATABASE_URL) {
  return mongoose
    .connect(url, { useMongoClient: true })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
    });
}

function dropDatabase() {
  return mongoose.connection.db.dropDatabase();
}

function disconnect() {
  return mongoose.disconnect();
}

function get() {
  return mongoose;
}

module.exports = { connect, dropDatabase, disconnect, get };
