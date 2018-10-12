'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const cors = require('cors');
const app = express();
const jwtAuth = require('./middleware/jwt-auth');
const db = require('./db/mongoose');

const hospitalListRouter = require('./routes/hospitals');
const patientListRouter = require('./routes/patients');
const usersRouter = require('./routes/users');

const { PORT, DATABASE_URL } = require('./config');
const authRouter = require('./routes/auth');

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/hospitals', hospitalListRouter);
app.use('/patients', jwtAuth, patientListRouter);
app.use('/users', usersRouter);

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}


app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: "Internal Server Error" });
    console.error(err);
  }
});

// Listen for incoming connections
if (process.env.NODE_ENV !== "test") {
  db.connect();

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on("error", err => {
    console.error(err);
  });
}


module.exports = app, runServer, closeServer;
