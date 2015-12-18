var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('charts/awareness', { title: 'Brand Performance Platform' })
});

// GET any other views
router.get('/*', function(req, res, next) {
  filename = req.params[0]
  res.render(filename, { title: 'Brand Performance Platform' })
});

module.exports = router;
