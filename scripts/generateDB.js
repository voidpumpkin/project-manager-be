const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(config.storage);
