var db = require('../config');
var mongoose = require('mongoose');
var crypto = require('crypto');


// Url Schema & methods
var UrlSchema = mongoose.Schema({
  url: String, 
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
});

UrlSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

var Link = mongoose.model('Link', UrlSchema);

module.exports = Link;
