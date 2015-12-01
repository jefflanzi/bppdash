// http://bost.ocks.org/mike/chart/
function barChart(selection) {

  function chart() {
    //- Draw SVG
    var margin = {top: 20, right: 20, bottom: 30, left: 140};
    var width = parseInt(selection.style('width')) - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

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

    var chart = selection.append('svg')
      .attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom,
        // viewBox: '0 0 ' + width + ' ' + height,
        // preserveAspectRatio: 'xMinYMin'
      })
      .append('g')
      .attr('id', 'chartArea')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //- load data and call constructor functions
    d3.csv('/data/jobTitles.csv', function(error, data) {

      //- Scales
      var xMax = d3.max(data, function(d) { return +d.Percent });
      xScale.domain([0, xMax]);
      yScale.domain(data.map(function(d) { return d.Title }));

      //- Draw Axis
      chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

      //- Create bar group elements
      var bars = chart.selectAll('g.new')
        .data(data)
        .enter()
        .append('g')
        .classed('bar', true);

      //- Draw bar rects
      bars.append('rect')
        .attr({
          x: xScale(0),
          y: function(d) { return yScale(d.Title) },
          width: 0,
          height: yScale.rangeBand()
        });

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

      resize(1000);
      d3.select(window).on('resize', function() { resize(500); });

    //- End d3.csv() function
    });

    //- responsive resize and animations
    function resize(duration) {

      var duration = duration || 500;

      width = parseInt(selection.style('width')) - margin.left - margin.right;
      xScale.range([0, width]);

      d3.select('#chart svg')
        .transition()
        .duration(duration)
        .attr('width', width + margin.left + margin.right + 'px');

      d3.selectAll('.bar rect')
        .transition()
        .duration(duration)
        .attr('width', function(d) { return xScale(+d.Percent) })

      d3.selectAll('.valueLabel')
        .transition()
        .duration(duration)
        .attr('x', function(d) { return xScale(+d.Percent) })

      d3.select('.x.axis')
        .transition()
        .duration(duration * 0.5)
        .call(xAxis);
      // d3.select('.y.axis').call(yAxis);
    }

  //- End function chart()
  }

  return chart;
  //- End function barChart()
  };
