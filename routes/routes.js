var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');

// Authentication routes
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login',  passport.authenticate('local'),  function(req, res) {
  res.redirect('/');
});

// Need separate admin authentication to protect user registration
router.get('/register', function(req, res) {
  res.render('register')
});

router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', {user: user});
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

// All routes after this will check for successful authentication
router.all('*', function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
});

router.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

// Chart views
router.get('/charts/:model', function(req, res, next) {
  res.render('chart', { title: 'Brand Performance Platform', model: req.params.model })
});

router.get('/roadmap', function(req, res, next) {
  res.render('roadmap');
});

module.exports = router;
