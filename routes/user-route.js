var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');
var requireAuth = require('./middleware/requireAuth')

// User registration form
router.get('/register', function(req, res) {
  res.render('register');
});

// Get a list of Users
router.get('/', requireAuth(), function(req, res) {
  User.find().select('-password').exec(function(err, users) {
    if(err) return console.log(err);
    res.json(users);
  });
});

// Create a new user
router.post('/', requireAuth(['site admin']), function(req, res) {
  console.log('req.body: ', req.body);
  User.register(
    new User({
      usertype: req.body.usertype,
      username: req.body.username
    }),
    req.body.password,
    function(err, user) {
      if (err) res.send(err);
      return res.json(user);
    }
  );
});

// Delete a user
router.post('/delete/:username', requireAuth(['site admin']), function(req, res) {
  User.findOneAndRemove({username: req.params.username}, function(err, doc) {
    if (err) console.error(err);
    res.json("deleted: " + doc.username);
  })
})

module.exports = router;
