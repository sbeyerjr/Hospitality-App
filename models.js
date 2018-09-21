'use strict';

const mongoose = require('mongoose');

const hospitalSchema = mongoose.Schema({
    name:{type: String, required: true},
    location:{type: String, required: false},
});

hospitalSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        location: this.location
    };
};

const patientSchema = mongoose.Schema({
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},
    roomNumber:{type: String, required: true},
    wantsVisitors:{type: Boolean, required: false},
    notes:{type: String, required: false}
});

patientSchema.methods.serialize = function() {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        roomNumber: this.roomNumber,
        wantsVisitors: this.wantsVisitors,
        notes: this.notes
    };
};

const Hospital = mongoose.model('Hospital', hospitalSchema);

const Patient = mongoose.model('Patient' , patientSchema);

module.exports = {Hospital, Patient};
