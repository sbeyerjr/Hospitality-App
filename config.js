'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://sbeyerjr:music123@ds263832.mlab.com:63832/hospitality-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://sbeyerjr:music123@ds263832.mlab.com:63832/hospitality-db';
exports.PORT = process.env.PORT || 8080;