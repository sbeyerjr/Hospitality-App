"use strict";

const { TEST_DATABASE_URL} = require("../config");
const Note = require("../models/note");
const Folder = require("../models/folder");
const Tag = require("../models/tag");
const User = require("../models/user");

const db = require("../db/mongoose");

const seedNotes = require("../db/seed/notes");
const seedFolders = require("../db/seed/folders");
const seedTags = require("../db/seed/tags");
const seedUsers = require("../db/seed/users");


db.connect(TEST_DATABASE_URL)
  .then(() => {
    console.info("Dropping Database");
    return db.dropDatabase();
  })
  .then(() => {
    console.info("Seeding Database");
    return Promise.all([

      Note.insertMany(seedNotes),

      Folder.insertMany(seedFolders),
      Folder.createIndexes(),

      Tag.insertMany(seedTags),
      Tag.createIndexes(),

      User.insertMany(seedUsers),
      User.createIndexes()

    ]);
  })
  .then(() => {
    console.info("Disconnecting");
    return db.disconnect();
  })
  .catch(err => {
    db.disconnect();
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });