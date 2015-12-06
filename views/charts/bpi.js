
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
var yScale = d3.scale.linear().range([0, height]);

var dataset;
d3.csv('/data/bpi.csv', function(error, data) {
  dataset = data;
  chart.draw();
});

// Create elements from data
chart.draw = function() {
  // Set scale domains
  var xValues = [];
  dataset.forEach(function(d) { xValues.push(d.Company)});
  xScale.domain(xValues);

  yScale.domain([0,100]);

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
      class: 'character',
      x: 0 + 0 * xScale.rangeBand() / 3,
      y: function(d) { return height - yScale(+d['Character']) },
      width: xScale.rangeBand() / 6,
      height: function(d) { return yScale(+d.Character) }
    })
    .style('fill', 'blue');

  companies.append('rect')
    .attr({
      class: 'relationship',
      x: 0 + 1 * xScale.rangeBand() / 3,
      y: function(d) { return height - yScale(+d['Customer Relationship']) },
      width: xScale.rangeBand() / 6,
      height: function(d) { return yScale(+d['Customer Relationship']) }
    })
    .style('fill', 'yellow');

  companies.append('rect')
    .attr({
      class: 'impact',
      x: 0 + 2 * xScale.rangeBand() / 3,
      y: function(d) { return height - yScale(+d['Impact']) },
      width: xScale.rangeBand() / 6,
      height: function(d) { return yScale(+d['Impact']) }
    })
    .style('fill', 'green');

  companies.append('circle')
    .attr({
      class: 'bpi',
      cx: xScale.rangeBand() / 2,
      cy: function(d) { return height - yScale(+d['BPI']) },
      r: xScale.rangeBand() / 8
    })
    .style('fill', 'red');

};
