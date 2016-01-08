var mongoose = require('mongoose');

var mongoURI = {
  development: 'mongodb://localhost/bppdash',
  test: 'mongodb://localhost/bppdash-test'
}
console.log('connecting to : ' + mongoURI[process.env.NODE_ENV]);
mongoose.connect(mongoURI[process.env.NODE_ENV]);

// check for successful connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongodb connected to ' + mongoURI[process.env.NODE_ENV]);
});
