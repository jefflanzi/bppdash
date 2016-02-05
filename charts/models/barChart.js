function barChart(selection) {
  // Declare variables
  var margin = {top: 20, right:20, bottom: 30, left: 140};
  var width;
  var height;
  var xScale = d3.scale.linear();
  var yScale = d3.scale.ordinal();

  // Configure Axes
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')

  //============================================================================
  // Load data and create chart
  //============================================================================
  d3.csv('/data/jobTitles', function(error, data) {
    // Scales
    scale();
    var xMax = d3.max(data, function(d) { return +d.Percent });
    xScale.domain([0, xMax]);
    yScale.domain(data.map(function(d) { return d.Title }));

    // Create Elements
    var chartArea = chart.area.create(selection);
    var bars = chart.bars.create(chartArea, data);
    chart.labels.create(bars);
    chart.axis.create(chartArea);

    // Animated intros
    resize(750, 150);
    // Hook to window Resize
    d3.select(window).on('resize', function() { resize(375, 75); });

  });

  //============================================================================
  // Adjust scales based on window size
  //============================================================================
  function scale() {
    width = parseInt(selection.style('width')) - margin.left - margin.right;
    height = parseInt(selection.style('height')) - margin.top - margin.bottom;

    xScale.range([0, width]);
    yScale.rangeRoundBands([0, height], 0.01);
  }

  //============================================================================
  // Resize the chart
  //============================================================================
  function resize(duration, delay) {
    scale();
    var duration = duration || 250;
    var delay = delay || 0;
    chart.area.update();
    chart.bars.update(duration, delay);
    chart.labels.update(duration, delay);
    chart.axis.update(duration);
  }

  //============================================================================
  // Chart elements
  //============================================================================
  var chart = {};

  chart.area = {
    create: function(selection) {
      return selection.append('svg')
        .attr('width', width + margin.left + margin.right + 'px')
        .attr('height', height + margin.top + margin.bottom + 'px')
        .append('g')
          .attr('id', 'chartArea')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');
    },
    update: function() {
      d3.select('#chart svg')
        .attr('width', width + margin.left + margin.right + 'px')
        .attr('height', height + margin.top + margin.bottom + 'px');

      d3.select('#chartArea')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    }
  }
  chart.axis = {
    create: function(selection) {
      selection.append('g')
        .attr('class', 'x axis');

      selection.append('g')
        .attr('class', 'y axis')
        .attr('transcorm', 'translate(' + width + ', 0)');
    },
    update: function(duration) {
      d3.select('.x.axis')
        .transition()
        .duration(duration)
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      d3.select('.y.axis')
        .transition()
        .duration(duration)
        .call(yAxis);
    }
  }
  chart.bars = {
    create: function(selection, data) {
      var groups =  selection.selectAll('.bar')
        .data(data)
        .enter()
        .append('g')
        .classed('bar', true)
      groups
        .append('rect')
        .attr({
          class: 'bar',
          x: 0,
          width: 0
        });
      return groups; // groups will be used to append labels, thus returned instead of the rects
    },
    update: function(duration, delay) {
      d3.selectAll('.bar rect')
      .transition()
      .delay(function(d, i) { return i * delay})
      .duration(duration)
      .attr({
        width: function(d) { return xScale(+d.Percent) },
        height: yScale.rangeBand(),
        y: function(d) { return yScale(d.Title) }
      })
    }
  }
  chart.labels = {
    create: function(selection) {
      return selection.append('text')
        .text(function(d) { return d3.format('.1%')(+d.Percent) })
        .attr({
          class: 'valueLabel',
          dx: '-1em',
          x: 0,
          y: function(d, i) { return yScale(d.Title) + yScale.rangeBand() / 2 },
          dy: '0.35em',
          'text-anchor': 'end'
        });
    },
    update: function(duration, delay) {
      d3.selectAll('.valueLabel')
        .transition()
        .delay(function(d, i) { return i * delay })
        .duration(duration)
        .attr('x', function(d) {return xScale(+d.Percent) })
        .attr('y', function(d) {return yScale(d.Title) + yScale.rangeBand() / 2 });
    }
  }

// end barChart()
}
