var express = require('express');
var router = express.Router();
var requireAuth = require('./middleware/requireAuth')
var User = require('../models/user');

router.get('/setup', function(req, res) {
  if(req.user) {
    res.redirect('/admin');
  }

  User.find(function(err, result) {
    if (result.length === 0) {
      res.render('setup');
    }
  });
})

router.post('/setup', function(req, res) {
  User.find(function(err, result) {
    if (result.length === 0) {
      User.register(
        new User({
          usertype: 'site admin',
          username: req.body.username
        }),
        req.body.password,
        function(err, user) {
          if (err) throw err;
          req.login(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/admin');
          })
        }
      );
    } else {
      return res.redirect('/admin');
    }
  })
})

router.get('/', requireAuth(['account admin', 'site admin']), function(req, res) {
  res.render('admin.jade');
});

module.exports = router;
