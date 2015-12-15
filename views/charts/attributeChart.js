function attributeChart(selection) {

  // Function global variables
  var w = parseInt(selection.style('width'))
  var margin = { top: 20, right: 20, bottom: 30, left: w * 0.2 };
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = parseInt(selection.style('height')) - margin.top - margin.bottom;

  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.ordinal().rangeRoundPoints([0, height]);
  // var color = d3.scale.category10();
  var color = d3.scale.ordinal()
    .range(["#222", "#4C4C4C", "#DA291C", "#7E7E7E"])

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(10, '%')
    .tickPadding(10);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickPadding(10)

  var data;
  d3.csv('/data/attributes.csv', function(d) {
    data = d;
    chart();
  });

  function chart() {
    var chartArea = selection.append('svg')
      .attr({
        id: 'chartSVG',
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
      })
      .style('background-color', "#E4E4E4")
      .append('g')
      .attr('id', 'chartArea')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scales
    var xValues = [];
    for (i in data) { xValues = xValues.concat(d3.values(data[i]).slice(2)); }
    xScale.domain([Number(d3.min(xValues)) - .01, Number(d3.max(xValues)) + .01]);

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

    // Axes
    chartArea.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    chartArea.append('g')
      .attr('class', 'y axis')
      .call(yAxis)

    d3.selectAll('.axis .domain')
      .style('stroke', 'none')

    d3.selectAll('.axis line')
      .style('stroke', '#FEFEFE')
      .style('stroke-width', '2px')

    // Company groups
    var companies = chartArea.selectAll('.company')
      .data(companies)
      .enter()
      .append('g')
      .attr('class', 'company');

    // Lines
    var line = d3.svg.line()
      .interpolate('linear')
      .x(function(d) { return xScale(d.rating) })
      .y(function(d) { return 0 })

    var lines = companies.append('path')
      .attr('class', 'line')
      .attr('d', function(d) { return line(d.values); })
      .style('stroke', function(d) { return color(d.name); })

    // Dots
    var dots = companies.selectAll('.dot')
      .data(function(d, index) {
        var a = [];
        d.values.forEach(function(point, i) {
          a.push({'name': d.name, 'point': point});
        });
        return a;
      })
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r',0)
      .attr('cx', function(d) { return xScale(d.point.rating) })
      .attr('cy', function(d) { return yScale(d.point.attribute) })
      .style('fill', function(d) { return color(d.name); });

    // responsive resize
    resize(1000); // Initial animation
    d3.select(window).on('resize', function() { resize(500) });

    function resize(duration) {
      duration = duration || 500;

      // Get new dimensions and rescale
      w = parseInt(selection.style('width'));
      margin = { top: 20, right: 20, bottom: 30, left: w * 0.3 };
      width = parseInt(selection.style('width')) - margin.left - margin.right;
      height = parseInt(selection.style('height')) - margin.top - margin.bottom;
      xScale.range([0, width]);
      yScale.rangeRoundPoints([0, height]);

      // Redraw
      selection.select('svg')
        .transition()
        .duration(duration)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      chartArea
        .transition()
        .duration(duration)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      xAxis
        .innerTickSize(0)

      yAxis
        .innerTickSize(-width)

      d3.select('.x.axis')
        .transition()
        .duration(duration)
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      d3.select('.y.axis')
        .transition()
        .duration(duration)
        .call(yAxis)
        .selectAll('text')
        .call(wrap, (margin.left - 20));

      line
        .x(function(d) { return xScale(d.rating) })
        .y(function(d) { return yScale(d.attribute) });

      lines
        .attr('d', function(d) { return line(d.values); })
        .attr('stroke-dasharray', function() {
          len = this.getTotalLength();
          return len + ' ' + len;
        })
        .attr('stroke-dashoffset', function() { return this.getTotalLength() })
        .transition()
        .delay(duration * 2 / 21)
        .duration(duration * 2)
        .ease('linear')
        .attr('stroke-dashoffset', function() { return 0 });

      dots
        .transition()
        .delay(function(d, i) { return (i-1) * duration * 2 / 21 } )
        .duration(duration / 2)
        .attr('r', 8)
        .attr('cx', function(d) { return xScale(d.point.rating) })
        .attr('cy', function(d) { return yScale(d.point.attribute) });

    // End resize()
    };

  // End chart()
  };

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
          tspan = text.text(null).append("tspan").attr("x", 0).attr("dx", "-1em").attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("dx", "-1em").attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

// End attributeChart()
};
