function pie(selection) {
  // Legends - http://bl.ocks.org/ZJONSSON/3918369
  // Global variables
  var chart = {};

  // Sizing
  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var width = 960;
  var height = 500;
  var radius = Math.min(width, height) / 2;

  // Pie stuff
  // var color = d3.scale.ordinal()
  //   .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  var color = d3.scale.category10();

  var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.Percent; });

  // Chart area
  var svg = selection.append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  // Load dataset
  var dataset;
  d3.csv('/data/model/jobTitles.csv', type, function(error, data) {
    if (error) throw error;

    dataset = data;
    var g = svg.selectAll('.arc')
      .data(pie(dataset))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', function(d) { return color(d.data.Title); });

    g.append('text')
      .attr('transform', function(d) { return 'translate(' + labelArc.centroid(d) + ')'; })
      .attr('dy', '0.35em')
      .text(function(d) { return d3.format('.1%')(d.data.Percent); })
      .attr('text-anchor', 'middle');
  // end d3.csv()
  });

  function type(d) {
    d.Percent = +d.Percent;
    return d;
  }

// End pie()
}
