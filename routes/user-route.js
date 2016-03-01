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
    if(err) return console.error(err);
    res.send(users);
  });
});

// Create a new user
router.post('/', requireAuth(['site admin']), function(req, res) {
  User.register(
    new User({
      usertype: req.body.usertype,
      username: req.body.username
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        return res.send(user);
      }
    });
});

// Delete a user
router.post('/:userid', requireAuth(['site admin']), function(req, res) {
  User.findOneAndRemove({_id: req.params.userid}, function(err, doc) {
    if (err) console.error(err);
    console.log('removed:', doc);
    res.send("deleted: " + doc.username);
  })
})

module.exports = router;
