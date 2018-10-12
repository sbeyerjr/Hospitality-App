"use strict";

const store = (function () {

  return {
    hospitals: [],
    patients: [],
    firstName: [],

    currentPatient: {},
    currentQuery: {
      searchTerm: "",
    },
    authToken: ""
  };

}());