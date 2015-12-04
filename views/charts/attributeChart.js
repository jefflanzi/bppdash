// Reference:
// http://bl.ocks.org/mbostock/3884955
function attributeChart(selection) {
  // Function global variables
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = parseInt(selection.style('height')) - margin.top - margin.bottom;

  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.ordinal().rangeRoundBands([0, height]);
  var color = d3.scale.category10();

  var chartArea = selection.append('svg')
    .attr({
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom
    })
    .append('g')
    .attr('id', 'chartArea')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  d3.csv('/data/attributes.csv', function(data) {
    // Scales
    var xValues = [];
    for (i in data) { xValues = xValues.concat(d3.values(data[i]).slice(2)); }
    xScale.domain(d3.extent(xValues));

    var yValues = [];
    for (i in data) { yValues.push(data[i].attribute) };
    yScale.domain(yValues);

    var companyNames = d3.keys(data[0]).filter(function(key) { return key !== 'attribute' & key !== 'order'});
    color.domain(companyNames);

    // Lines
    var companies = companyNames.map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {attribute: d.attribute, rating: +d[name]};
        })
      };
    });

    var line = d3.svg.line()
      .x(function(d) { return xScale(d.rating) })
      .y(function(d) { return yScale(d.attribute) })

    var company = chartArea.selectAll('.company')
      .data(companies)
      .enter()
      .append('g')
      .attr('class', 'company');

    company.append('path')
      .attr('class', 'line')
      .attr('d', function(d) { return line(d.values); })
      .style('stroke', function(d) { return color(d.name); });

    // Dots
    // company.append('circle')
    //   .attr({
    //     cx: function(d) { xScale(d.values.rating) },
    //     cy: function(d) { yScale(d.values.attribute) },
    //     r: 5
    //   });



  // End d3.csv()
  });

// End attributeChart()
}