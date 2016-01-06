var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find(function (err, users) {
    if (err) return console.error(err);
    res.send(users);
  })
});

// GET a single user by ID
router.get('/:id', function(req, res) {
  User.findById(req.params.id, function(err, data) {
    if(err) return console.error(err);
    res.send(data);
  });
});

// create user
router.post('/', function(req, res) {
  var user = new User(req.body);
  user.save(function (err) {
    if (err) return console.error(err);
  });

  res.json(user);
});

module.exports = router;
