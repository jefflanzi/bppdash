var express = require('express');
var router = express.Router();
var fs = require('fs');

var username = 'skillsoft';

router.get('/model/:model', function(req, res) {
  console.log(req.params.model);
  var ext = req.params.model === 'marketMap' ? '.json' : '.csv';
  var path = './datasets/' + req.user.username + '/' + req.params.model + ext;
  var file = fs.readFile(path, function (err, data) {
    res.send(data);
  });
});

router.get('/upload', function(req, res) {
  res.render('upload', {user: req.user});
});

router.post('/upload', function(req, res) {
  var path = './datasets/' + req.user.username + '/' + req.params.file.filename;
  fs.write(path, data, function(err) {
    if (err) throw err;
    res.send('Upload successful');
  });
});

module.exports = router;
