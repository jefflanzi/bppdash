
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
d3.csv('/data/salesFunnel.csv', function(error, data) {
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
      class: 'awareness',
      x: 0,
      y: function(d) { return height - yScale(d.Awareness) },
      width: xScale.rangeBand(),
      height: function(d) { return yScale(d.Awareness) }
    });

    companies.append('rect')
      .attr({
        class: 'consideration',
        x: 0,
        y: function(d) { return height - yScale(d.Consideration) },
        width: xScale.rangeBand(),
        height: function(d) { return yScale(d.Consideration) }
      })
      .style('fill', 'red');

      companies.append('rect')
        .attr({
          class: 'preference',
          x: 0,
          y: function(d) { return height - yScale(d.Preference) },
          width: xScale.rangeBand(),
          height: function(d) { return yScale(d.Preference) }
        })
        .style('fill', 'yellow');

      companies.append('rect')
        .attr({
          class: 'purchase',
          x: 0,
          y: function(d) { return height - yScale(d['Purchase Intent']) },
          width: xScale.rangeBand(),
          height: function(d) { return yScale(d['Purchase Intent']) }
        })
        .style('fill', 'green');

};
