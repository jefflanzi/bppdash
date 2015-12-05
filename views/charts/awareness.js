
// Testing Variables
var selection = d3.select('#chart');
var chart = {};

// Global Variables
var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = parseInt(selection.style('width')) - margin.left - margin.right;
var height = 600
// var height = parseInt(selection.style('height')) - margin.top - margin.bottom;

// Scales
var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
var yScale = d3.scale.linear().range([height, 0]);

var dataset;
d3.csv('/data/awareness.csv', function(error, data) {
  dataset = data;
  chart.draw();
});

// Create elements from data
chart.draw = function() {
  // Set scale domains
  var xValues = [];
  dataset.forEach(function(d) { xValues.push(d.Company)});
  xScale.domain(xValues);

  yScale.domain([0,1]);

  // Create SVG and translated chart area g
  var chartArea = selection.append('svg')
    .attr({
      'width': width + margin.left + margin.right,
      'height': height + margin.top + margin.bottom
    })
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.left + ')');

  // Create company groups and bars
  var companies = chartArea.selectAll('.companies')
    .data(dataset)
    .enter()
    .append('g')
    .attr('class', 'company')
    .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)' });

  companies.append('rect')
    .attr({
      x: 0,
      y: 0,
      width: function(d) { return xScale.rangeBand() },
      height: function(d) { return yScale(d.Unaided) }
    });
};
