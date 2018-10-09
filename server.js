"use strict";
require('dotenv').config();
const express = require("express"); 
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jsonParser = bodyParser.json();
const cors = require("cors");
const app = express();
const jwtAuth = require("./middleware/jwt-auth");

const hospitalListRouter = require('./routes/hospitals');
const patientListRouter = require('./routes/patients');
const usersRouter = require("./routes/users");


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { PORT, DATABASE_URL } = require('./config');
const {Hospital} = require("./models/hospital");
const {Patient} = require("./models/patient")
const authRouter = require("./routes/auth");



app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use('/hospitals', hospitalListRouter);
app.use('/patients', jwtAuth, patientListRouter);
app.use('/users', usersRouter);




app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});
  

let server;


function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
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

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
