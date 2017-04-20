var crypto = require('crypto');
var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

mongoURI = 'mongodb://localhost/test';
mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongodb connection open');
});

module.exports = db;