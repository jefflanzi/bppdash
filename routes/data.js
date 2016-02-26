var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

//==============================================================================
// Configure file upload middleware
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      var path = './datasets/' + req.body.username;
      fs.mkdir(path, function(err) {
        if (err && err.code ==='EEXIST') return;
      });
      cb(null, path);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({storage: storage});

//==============================================================================
// Define routes

// Return a file with filename matching the model parameter
router.get('/model/:model', function(req, res) {
  console.log(req.params.model);
  var ext = req.params.model === 'marketMap' ? '.json' : '.csv';
  var path = './datasets/' + req.user.username + '/' + req.params.model + ext;
  var file = fs.readFile(path, function (err, data) {
    res.send(data);
  });
});

// Render file upload page
router.get('/upload', function(req, res) {
  res.render('admin/upload', {user: req.user});
});

// Upload file to user's data folder
router.post('/upload', upload.single('file'), function(req, res) {
  console.log(req.file);
  res.send(req.file);
  // res.send('file uploaded to ' + req.file.path);
});

module.exports = router;
