var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var userRoute = require('./user-route');
var adminRoute = require('./admin-route');
var dataRoute = require('./data-route');


// Import routes
router.use('/user', userRoute);
router.use('/data', dataRoute);
router.use('/admin', adminRoute);

// Login
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login',  passport.authenticate('local'),  function(req, res) {
  res.redirect('/');
});

// All routes after this will check for successful authentication
router.all('*', function(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.redirect('/login');
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
  res.render('chart', { title: 'Brand Performance Platform', model: req.params.model });
});

router.get('/roadmap', function(req, res, next) {
  res.render('roadmap');
});

module.exports = router;
