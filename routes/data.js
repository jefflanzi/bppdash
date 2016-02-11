var express = require('express');
var router = express.Router();
var fs = require('fs');

var username = 'skillsoft';

router.get('/:model', function(req, res) {
  var ext = req.params.model === 'marketMap' ? '.json' : '.csv';
  var path = './datasets/' + req.user.username + '/' + req.params.model + ext;
  var file = fs.readFile(path, function (err, data) {
    res.send(data);
  });
});

module.exports = router;
