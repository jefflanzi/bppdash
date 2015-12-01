function attributeChart(selection) {
  // Function global variables
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = window.innerWidth - parseInt(d3.select('.navbar').style('height')) - margin.top - margin.bottom;

  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.ordinal().rangeRoundBands([0, height]);

  var chartArea = selection.append('svg')
    .attr({
      width: width + margin.left + margin.right,
      height: width + margin.top + margin.bottom
    })
    .append('g')
    .attr('id', 'chartArea')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var dataset = {}
  d3.csv('/data/attributes.csv', function(data) {
    dataset = data;
  });

  var xMin = d3.min(dataset, function(d) {
    return d3.min(d3.values(d).slice(2))
  });
  var xMax = d3.max(dataset, function(d) {
    return d3.max(d3.values(d).slice(2))
  });

  var values = [];
  for (var i = 0; i < dataset.length; i++) {
    values = values.concat(d3.values(dataset[i]).slice(2));
  }


  return dataset;
// End attributeChart()
}
