var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().then(links => {
    res.status(200).send(JSON.stringify(links));
  }).catch( (e)=> {
    console.log('Error:', e);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  var prom = Link.findOne({ url: uri }).exec();

  prom
    .then(link => {
      res.status(200).send(JSON.stringify(link));
    })
    .catch(e => {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });

        newLink.save().then(newLink => {
          res.status(200).send(JSON.stringify(newLink));
        });
      });
    });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var prom = User.findOne({ username: username }).exec();
  prom
    .then( user => {
      user.comparePassword(password, match => {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    })
    .catch( e => {
      res.redirect('/login');
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var prom = User.findOne({ username: username }).exec();
  prom
    .then( user => {
      console.log('Account already exists');
      res.redirect('/signup');
    })
    .catch( e => {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save()
        .then(function(newUser) {
          util.createSession(req, res, newUser);
        });
    });
};

exports.navToLink = function(req, res) {
  var prom = Link.findOne({ code: req.params[0] }).exec();
  prom
    .then( link => {
      link.visits = link.visits + 1;
      link.save();
    })
    .catch( e => {
      res.redirect('/');
    })
    .then(function(link) {
      return res.redirect(link.url);
    });
};