var express = require('express');
var router = express.Router();
var requireAuth = require('./middleware/requireAuth')

router.get('/', requireAuth(['account admin', 'site admin']), function(req, res) {
  res.render('admin.jade');
});

module.exports = router;
