// http://bost.ocks.org/mike/chart/
function barChart(selection) {
  //- Draw SVG
  var margin = {top: 20, right: 20, bottom: 30, left: 140};
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = parseInt(selection.style('height')) - margin.top - margin.bottom;

  var xScale = d3.scale.linear()
    .range([0, width]);

  var yScale = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.01);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

  function chart() {
    var chartArea = selection.append('svg')
      .attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom,
      })
      .append('g')
      .attr('id', 'chartArea')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //- load data and call constructor functions
    d3.csv('/data/jobTitles', function(error, data) {
      //- Scales
      var xMax = d3.max(data, function(d) { return +d.Percent });
      xScale.domain([0, xMax]);
      yScale.domain(data.map(function(d) { return d.Title }));

      //- Draw Axis
      chartArea.append('g')
        .attr('class', 'x axis')

      chartArea.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + width + ', 0)')

      //- Create bar group elements
      var bars = chartArea.selectAll('g.bar')
        .data(data)
        .enter()
        .append('g')
        .classed('bar', true);

      //- Draw bar rects
      bars.append('rect')
        .attr('x', 0)
        .attr('width', 0);

      //-  Draw bar value Labels
      var valuePad = .01;
      bars.append('text')
        .text(function(d) { return d3.format('.1%')(+d.Percent) })
        .classed('valueLabel', true)
        .attr({
          x: 0,
          dx: '-1em',
          y: function(d, i) { return yScale(d.Title) + yScale.rangeBand() / 2 },
          dy: '0.35em',
          'text-anchor' : 'end'
        });

      chart.resize(1000);
      d3.select(window).on('resize', function() { chart.resize(500); });

    //- End d3.csv()
    });
  //- End chart.draw()
  }

  //- responsive resize and animations
  chart.resize = function resize(duration) {

    var duration = duration || 500;

    width = parseInt(selection.style('width')) - margin.left - margin.right;
    height = parseInt(selection.style('height')) - margin.top - margin.bottom;
    xScale.range([0, width]);
    yScale.rangeRoundBands([0, height], 0.01);

    d3.select('#chart svg')
      .transition()
      .duration(duration)
      .attr('width', width + margin.left + margin.right + 'px')
      .attr('height', height + margin.top + margin.bottom + 'px');

    d3.selectAll('.bar rect')
      .transition()
      .delay(function(d, i ) { return i * 100} )
      .duration(duration)
      .attr('width', function(d) { return xScale(+d.Percent) })
      .attr('y', function(d) { return yScale(d.Title) })
      .attr('height', yScale.rangeBand());

    d3.selectAll('.valueLabel')
      .transition()
      .delay(function(d, i ) { return i * 100} )
      .duration(duration)
      .attr('x', function(d) { return xScale(+d.Percent) })
      .attr('y', function(d) { return yScale(d.Title) + yScale.rangeBand() / 2 });

    d3.select('.x.axis')
      .transition()
      .duration(duration)
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    d3.select('.y.axis')
      .transition()
      .duration(duration)
      .attr('transform', 'translate(' + 0 + ', 0)')
      .call(yAxis);

  // End chart.resize();
  }

  return chart;
//- End barChart()
};
