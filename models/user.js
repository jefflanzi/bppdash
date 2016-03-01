var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: String,
  usertype: {
    type: String,
    unique: true,
    lowercase: true,
    enum: ["basic user", "account admin", "site admin"]

  },
  password: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
