'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://sbeyerjr:music123@ds263832.mlab.com:63832/hospitality-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/hospitality-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
