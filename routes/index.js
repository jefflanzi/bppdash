var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Brand Performance Platform' })
});

// GET any other views
router.get('/charts/*', function(req, res, next) {
  filename = 'charts/' + req.params[0]
  res.render(filename, { title: 'Brand Performance Platform' })
});

router.get('/roadmap', function(req, res, next) {
  res.render('roadmap');
});

module.exports = router;
