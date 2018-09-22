"use strict";

const express = require("express");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bodyparser = require("body-parser");

const { PORT, DATABASE_URL } = require('./config');

const app = express();

const jsonparser = bodyparser.json();

app.use(express.static("public"));

const {Hospital} = require("./models");
const {Patient} = require("./models")

app.use(express.json());

app.get('/hospitals', (req, res) => {
    Hospital
      .find()    
      .then(hospitals => {
        res.json({
          hospitals: hospitals.map(
            (hospital) => hospital.serialize())
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      });
  });

  app.get('/patients', (req, res) => {
    Patient
      .find()    
      .then(patients => {
        res.json({
          patients: patients.map(
            (patient) => patient.serialize())
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      });
  });

  app.post('/hospitals', jsonparser, (req, res) => {
    console.log(req.body);
    const requiredFields = ["name", "location"];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\`. Please put in the required field(s).`;
        console.error(message);
        return res.status(400).send(message); 
      }
    }

    return Hospital.create({
      name:req.body.name,
      location: req.body.location
    })

    .then(hospital => res.status(201).json(hospital.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
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