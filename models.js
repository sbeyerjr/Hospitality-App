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

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = {Hospital};
