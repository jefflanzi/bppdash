// Reference:
// http://bl.ocks.org/mbostock/3884955
function attributeChart(selection) {
  // Function global variables
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = parseInt(selection.style('height')) - margin.top - margin.bottom;

  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.ordinal().rangeRoundBands([0, height]);

  var chartArea = selection.append('svg')
    .attr({
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom
    })
    .append('g')
    .attr('id', 'chartArea')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  d3.csv('/data/attributes.csv', function(data) {
    dataset = data;
    // var xMin = d3.min(data, function(d) {
    //   return d3.min(d3.values(d).slice(2))
    // });
    // var xMax = d3.max(data, function(d) {
    //   return d3.max(d3.values(d).slice(2))
    // });

    // Scales
    var xValues = [];
    for (i in data) {
      xValues = xValues.concat(d3.values(data[i]).slice(2));
    }
    xScale.domain(d3.extent(xValues));

    var yValues = [];
    for (i in data) {
      yValues.push(data[i].attribute)
    }
    console.log(yValues);
    yScale.domain(yValues);

    // Lines
    var line = d3.svg.line()
      .x(function(d) { return xScale(d['Cornerstone OnDemand']) })
      .y(function(d) { return yScale(d.attribute) })

    chartArea.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)
  });

// End attributeChart()
}
