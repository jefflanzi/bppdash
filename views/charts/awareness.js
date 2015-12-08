function awarenessChart(selection) {

  // Global Variables
  var chart = {};
  var margin = {top: 10, right: 0, bottom: 50, left: 40};
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = parseInt(selection.style('height')) - margin.top - margin.bottom;
  // var height = 600 - margin.top - margin.bottom;

  // Scales
  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
  var yScale = d3.scale.linear().range([0, height]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickFormat(d3.format('%'));

  // Load dataset
  var dataset;
  d3.csv('/data/awareness.csv', function(error, data) {
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
      // .style('background-color', '#E8E6E7')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Background rect
    chartArea.append('rect')
      .attr('class', 'background')
      .attr({width: width, height: height})
      .style('fill', '#E8E6E7');

    // Create company groups and bars
    var companies = chartArea.selectAll('.company')
      .data(dataset)
      .enter()
      .append('g')
      .attr('class', 'company')
      .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)' });

    companies.append('rect')
      .attr('class', 'companyBG')
      .attr('width', xScale.rangeBand())
      .attr('height', 0)
      .style('fill', '#F2F2F2');

    companies.append('rect')
      .attr({
        class: 'aided',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      })
      .style('fill', '#AFAFAF');

    companies.append('rect')
      .attr({
        class: 'unaided',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      })
      .style('fill', '#222');

    // Draw Axis
    chartArea.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .selectAll('text')
      // .attr('transform', 'rotate(-90)')
      .call(wrap, xScale.rangeBand());

    chartArea.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Responsive resigin
    chart.resize(1000);
    d3.select(window).on('resize', function() { chart.resize(500); });
  // End chart.draw();
  };

  chart.resize = function resize(duration) {

    var duration = duration || 500;

    width = parseInt(selection.style('width')) - margin.left - margin.right;
    height = parseInt(selection.style('height')) - margin.top - margin.bottom;
    xScale.rangeRoundBands([0, width], .1);
    yScale.range([0, height]);

    d3.select('#chart svg')
      .transition()
      .duration(duration)
      .attr('width', width + margin.left + margin.right + 'px')
      .attr('height', height + margin.top + margin.bottom + 'px');

    d3.selectAll('.company')
      .transition()
      .duration(duration)
      .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)' });

    d3.selectAll('.background')
      .transition()
      .duration(duration)
      .attr('width', width)
      .attr('height', height);

    d3.selectAll('.companyBG')
      .transition()
      .duration(function(d, i) { return duration + i * 50 } )
      .attr('width', xScale.rangeBand())
      .attr('height', height);

    d3.selectAll('.aided')
      .transition()
      .delay(function(d, i) { return duration + i * 50 })
      .duration(duration)
      .attr('y', function(d) { return height - yScale(d.Aided) })
      .attr('height', function(d) { return yScale(d.Aided) })
      .attr('width', xScale.rangeBand());

    d3.selectAll('.unaided')
      .transition()
      .delay(function(d, i) { return duration * 1.5 + i * 50 })
      .duration(duration)
      .attr('y', function(d) { return height - yScale(d.Unaided) })
      .attr('height', function(d) { return yScale(d.Unaided) })
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
      .attr('transform', 'translate(' + 0 + ', 0)')
      .call(yAxis);
  // End chart.resize()
  }

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
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }
// End awarenessChart()
}
