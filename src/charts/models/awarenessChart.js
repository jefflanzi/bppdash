module.exports = function awarenessChart(selection) {

  // Function Variables
  var margin = {top: 10, right: 0, bottom: 50, left: 50};
  var width;
  var height;
  var dataset;
  var xScale = d3.scale.ordinal();
  var yScale = d3.scale.linear();

  // Configure Axes
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(10, "%");

  // Load dataset and draw chart
  d3.csv('/data/awareness', function(error, data) {
    dataset = data;
    scale();
    draw();
    resize(1000); // Call for initial animations
    // Listen for window resize
    d3.select(window).on('resize', function() { resize(500); });
  });

  //============================================================================
  // Reusable Functions
  //============================================================================
  //============================================================================
  // Draw primary chart elements from data
  //============================================================================
  function draw() {
    // Set scale domains
    var xValues = [];
    dataset.forEach(function(d) { xValues.push(d.Company); });
    xScale.domain(xValues);
    yScale.domain([0, 1]);

    // Create SVG and translated chart area g
    selection.attr('class', 'awarenessChart');
    var chartArea = selection.append('svg')
      .attr({
        'width': width + margin.left + margin.right,
        'height': height + margin.top + margin.bottom
      })
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Create company groups and bars
    var companies = chartArea.selectAll('.company')
      .data(dataset)
      .enter()
      .append('g')
      .attr('class', 'company')
      .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)'; });

    companies.append('rect')
      .attr('class', 'companyBG')
      .attr('width', xScale.rangeBand())
      .attr('height', 0);

    companies.append('rect')
      .attr({
        class: 'aided interactive',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      });

    companies.append('rect')
      .attr({
        class: 'unaided interactive',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      });

    // Draw Axis
    chartArea.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .selectAll('text')
      .call(wrap, xScale.rangeBand());

    chartArea.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Bind interactions
    d3.selectAll('rect.interactive')
      .on('mouseover', function() {
        var thisClass = '.' + d3.select(this).attr('class').split(/\s+/)[0];
        d3.selectAll(thisClass).classed('highlight', true);
        d3.selectAll('.interactive:not(' + thisClass + ')')
          .style('opacity', 0.5);
      });

    d3.selectAll('rect.interactive')
      .on('mouseout', function() {
        var thisClass = '.' + d3.select(this).attr('class').split(/\s+/)[0];
        d3.selectAll(thisClass).classed('highlight', false);
        d3.selectAll('.interactive:not(' + thisClass + ')')
          .style('opacity', 1);
      });

  // End draw();
  }

  //============================================================================
  // Resize the chart elements when window resizes
  //============================================================================
  function resize(duration) {
    duration = duration || 500;
    scale();

    d3.select('#chart svg')
      .transition()
      .duration(duration)
      .attr('width', width + margin.left + margin.right + 'px')
      .attr('height', height + margin.top + margin.bottom + 'px');

    d3.selectAll('.company')
      .transition()
      .duration(duration)
      .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)'; });

    d3.selectAll('.background')
      .transition()
      .duration(duration)
      .attr('width', width)
      .attr('height', height);

    d3.selectAll('.companyBG')
      .transition()
      .duration(function(d, i) { return duration + i * 50; })
      .attr('width', xScale.rangeBand())
      .attr('height', height);

    d3.selectAll('.aided')
      .transition()
      .delay(function(d, i) { return duration + i * 50; })
      .duration(duration)
      .attr('y', function(d) { return yScale(d.Aided); })
      .attr('height', function(d) { return height - yScale(d.Aided); })
      .attr('width', xScale.rangeBand());

    d3.selectAll('.unaided')
      .transition()
      .delay(function(d, i) { return duration * 1.5 + i * 50; })
      .duration(duration)
      .attr('y', function(d) { return yScale(d.Unaided); })
      .attr('height', function(d) { return height - yScale(d.Unaided); })
      .attr('width', xScale.rangeBand());

    d3.select('.x.axis')
      .transition()
      .duration(duration)
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .selectAll('text')
      .call(wrap, xScale.rangeBand());

    d3.select('.y.axis')
      .transition()
      .duration(duration)
      .call(yAxis);

  // End resize()
  }

  //============================================================================
  // Adjust scales based on window size
  //============================================================================
  function scale() {
    width = parseInt(selection.style('width')) - margin.left - margin.right;
    height = parseInt(selection.style('height')) - margin.top - margin.bottom;

    xScale.rangeRoundBands([0, width], 0.1);
    yScale.range([height, 0]);
  }

  //============================================================================
  // Wrap text elements
  //============================================================================
  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y)
            .attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

// End awarenessChart()
};
