var mongoose = require('mongoose');
var fs = require('fs');
var SurveyData = require('../models/SurveyData');

mongoose.connect('localhost', 'bppdatatest');

var lineList = fs.readFileSync('./datasets/Skillsoft EOF Final CE Data (628-038).csv')
  .toString().split('\n');

console.log(lineList.shift().split(','));
