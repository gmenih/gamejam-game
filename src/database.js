let mongoose = require('mongoose');

let config = require('../config');

let db = mongoose.connect(config.mongo.uri(), config.mongo.options);
db.connection.on('open', (ref) => {
  console.log('MongoDB connection opened');
});

db.connection.on('error', (err) => {
  console.log('Error while establishing MongoDB.connection connection');
  console.log(err);
  console.log(`ReadyState: ${db.connection.readyState}`)
});

db.connection.on('disconnected', () => {
  console.log('MongoDB.connection disconnected');
  console.log('Attempting to reconnect...');
  mongoose.createConnection(config.mongo.url, config.mongo.options);
});

db.connection.on('reconnected', (ref) => {
  console.log('MongoDB connection re-established');
});

module.exports = db.connection;