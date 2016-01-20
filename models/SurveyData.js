var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurveyData = new Schema({
  username: String,
  data: []
});

module.exports = mongoose.model('SurveyData', SurveyData);
