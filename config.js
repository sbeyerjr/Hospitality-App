'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://sbeyerjr:music123@ds159772.mlab.com:59772/blog-database';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://sbeyerjr:music123@ds159772.mlab.com:59772/blog-database';
exports.PORT = process.env.PORT || 8080;