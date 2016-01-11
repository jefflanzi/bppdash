//==============================================================================
// Dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(session);

//==============================================================================
// Express app setup
var app = express();

// jade setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Express Middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//==============================================================================
// Mongoose
var envURIs = {
  development: 'mongodb://localhost/bppdash',  
  test: 'mongodb://localhost/bppdash-test',
  production: process.env.MONGOLAB_URI
}
var mongoURI = envURIs[app.get('env')];
console.log('connecting to : ' + mongoURI);
mongoose.connect(mongoURI);

// check for successful connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongodb connected to ' + mongoURI);
});

//==============================================================================
// Passport middleware
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'secret',
  // store: new MongoStore({ url: 'mongodb://localhost/bppdash-sessions' })
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==============================================================================
// Routes
var routes = require('./routes/routes');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//==============================================================================
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//==============================================================================
// Export app
module.exports = app;
