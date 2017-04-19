var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/test');

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
});

// User schema & methods
var UserSchema = mongoose.Schema({
  username: {type: String, unique: true, required: true, dropDups: true}, 
  password: String
});

UserSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

UserSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

module.exports.UrlSchema = UrlSchema;
module.exports.UserSchema = UserSchema;
module.exports.mongoose = mongoose;





















