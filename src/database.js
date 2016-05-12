let mongoose = require('mongoose');

let config = require('../config');
let db = mongoose.createConnection(config.mongo.uri(), config.mongo.options);

db.on('open', (ref) => {
  console.log('MongoDB connection opened');
});

db.on('error', (err) => {
  console.log('Error while establishing MongoDB connection');
  console.log(err);
  console.log(`ReadyState: ${db.readyState}`)
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
  console.log('Attempting to reconnect...');
  mongoose.createConnection(config.mongo.url, config.mongo.options);
});

db.on('reconnected', (ref) => {
  console.log('MongoDB connection re-established');
});

module.exports = db;