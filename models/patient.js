'use strict';

const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  roomNumber: { type: String, required: false },
  wantsVisitors: { type: Boolean, required: false },
  notes: { type: String, required: false },
  hospital: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

patientSchema.methods.serialize = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    roomNumber: this.roomNumber,
    wantsVisitors: this.wantsVisitors,
    notes: this.notes,
    hospital: this.hospital,
    userId: this.userId
  };
};

const Patient = mongoose.model('Patient', patientSchema);

module.exports = { Patient };
