"use strict";
exports.DATABASE_URL =
  global.DATABASE_URL ||
  'mongodb://localhost:27017/pet-pal';
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || 'asd';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';