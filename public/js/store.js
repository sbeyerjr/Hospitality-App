'use strict';

const store = (function() {
  return {
    hospitals: [],
    patients: [],

    currentPatient: {},
    currentQuery: {
      searchTerm: ''
    },
    authToken: ''
  };
})();
