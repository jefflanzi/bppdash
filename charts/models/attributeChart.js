function attributeChart(selection) {

  //============================================================================
  // Function global variables
  var w = parseInt(selection.style('width'));
  var h = parseInt(selection.style('height'));
  var margin = { top: 0, right: 20, bottom: 30, left: w * 0.3 };
  var width = w - margin.left - margin.right;
  var height = h - margin.top - margin.bottom;

  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.ordinal().rangeBands([0, height]);
  var color = d3.scale.ordinal().range(["#222", "#4C4C4C", "#DA291C", "#7E7E7E"])
  var legendScale = d3.scale.ordinal().rangeBands([0, width]);

  // Axis Variables
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(10, '%')
    .tickPadding(10);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickPadding(10)

  //============================================================================
  // Load data and call chart
  var data;
  d3.csv('/data/attributes', function(d) {
    data = d;
    chart();
  });

  //============================================================================
  // Main chart funcion
  function chart() {

    // Scales
    var xValues = [];
    for (i in data) { xValues = xValues.concat(d3.values(data[i]).slice(2)); }
    xScale.domain([Number(d3.min(xValues)) - 0.01, Number(d3.max(xValues)) + 0.01]);

    var yValues = ['legend1'];
    for (i in data) { yValues.push(data[i].attribute) };
    yScale.domain(yValues);

    var companyNames = d3.keys(data[0]).filter(function(key) { return key !== 'attribute' & key !== 'order'});
    color.domain(companyNames);

    // Lines
    var companyData = companyNames.map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {attribute: d.attribute, rating: +d[name]};
        })
      };
    });
    legendScale.domain(companyNames);

    //============================================================================
    // Draw SVG elements
    selection.attr('class', 'attributeChart');
    selection.append('svg')
      .attr({
        id: 'chartSVG',
        width: w,
        height: h
      });

    // Tooltip Selector rectangles
    var tooltipSelectors = d3.select('#chartSVG')
      .append('g')
      .attr('id', 'tooltipSelectors')
      .selectAll('.tooltipSelector')
      .data(companyData[0].values)
      .enter()
      .append('rect')
      .attr('class', function(d, i) { return 'a' + i })
      .attr({
        x: 0,
        y: function(d) { return yScale(d.attribute) },
        width: w,
        height: yScale.rangeBand()
      });

    var chartArea = d3.select('#chartSVG')
      .append('g')
      .attr('id', 'chartArea')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Axes
    chartArea.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    chartArea.append('g')
      .attr('class', 'y axis')
      .call(yAxis)

    // Company groups
    var companies = chartArea.selectAll('.company')
      .data(companyData)
      .enter()
      .append('g')
      .attr('class', 'company')
      .attr('transform', 'translate(0,' + 0.5 * yScale.rangeBand() + ')');

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
      .attr('class', function(d, i) { return 'a' + i })
      .attr('r',0)
      .attr('cx', function(d) { return xScale(d.point.rating) })
      .attr('cy', function(d) { return yScale(d.point.attribute) })
      .style('fill', function(d) { return color(d.name); });

    //============================================================================
    // Legend
    var legend = d3.select('#chartSVG')
      .append('g')
      .attr('id', 'legend');

    legend
      .on('mouseover', function() {
        d3.selectAll('.tooltip')
          .style('opacity', 0);
      });

    var legendBG = legend.append('rect')
      .attr('class', 'legendBG')

    var legendItems = legend.selectAll('.legendItem')
      .data(companyNames)
      .enter()
      .append('g')
      .attr('class', 'legendItem')
      .attr('transform', function (d) { return 'translate(' + (margin.left + legendScale(d)) + ',0)' })

    var keyBGs = legendItems.append('rect')
      .attr({
        class: 'legend',
        x: 0,
        y: 0,
        width: legendScale.rangeBand(),
        height: yScale.rangeBand()
      });

    var legendCircles = legendItems
      .append('circle')
      .attr({
        class: 'legend',
        cx: 0.4 * yScale.rangeBand(),
        cy: 0.5 * yScale.rangeBand(),
        r: 0.3 * yScale.rangeBand()
      })
      .style('fill', function (d) { return color(d) });

    var legendText = legendItems
      .append('text')
      .text(function (d) { return d } )
      .attr({
        class: 'legend',
        x: yScale.rangeBand(),
        y: 0.5 * yScale.rangeBand(),
        dy: '0.33em'
      })


    //============================================================================
    // tooltips
    var seedData = d3.selectAll('circle.a0').data();
    var tooltips = d3.select('#chart')
      .selectAll('.tooltip')
      .data(seedData)
      .enter()
      .append('div')
      .attr('class', 'tooltip');

    // tooltips: position on mouseover
    tooltipSelectors
      .on('mouseover', function () {
        var thisClass = '.' + d3.select(this).attr('class');
        var thisData = d3.selectAll('circle' + thisClass)
          .data()
          .sort(function(a, b) {
            return a.point.rating - b.point.rating
          });

        tooltips
          .data(thisData)
          .text(function(d) { return d3.format('%1')(d.point.rating) })
          .style('left', function(d) {
            thisWidth = parseInt(d3.select(this).style('height'))
            // return margin.left - 0.5*thisWidth + xScale(d.point.rating) + 'px'
            return margin.left + xScale(d.point.rating) + 'px'
          })
          .style('top', function(d, i) {
            var thisHeight = parseInt(d3.select(this).style('height'));
            var circleHeight = parseInt(d3.select('.company circle').attr('r'));
            var center = yScale.rangeBand()/2 - thisHeight/2;
            var coeff = 1-(2*(i%2));
            var offset = coeff * (circleHeight + thisHeight/2);
            return yScale(d.point.attribute) + center + offset + 'px';
          })
          .style('background-color', function(d) { return color(d.name); })
          .style('opacity', 1);
      // End .on('mouseover')
      });

    // responsive resize
    resize(1000); // Initial animation
    d3.select(window).on('resize', function() { resize(500) });

    //============================================================================
    // Responsive resive function
    function resize(duration) {
      duration = duration || 500;

      // Get new dimensions and rescale
      w = parseInt(selection.style('width'));
      h = parseInt(selection.style('height'));
      margin = { top: 0, right: 20, bottom: 30, left: w * 0.3 };
      width = w - margin.left - margin.right;
      height = h - margin.top - margin.bottom;
      xScale.range([0, width]);
      yScale.rangeBands([0, height]);

      // Redraw
      d3.select('#chartSVG')
        .transition()
        .duration(duration)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      tooltipSelectors
        .attr({
          x: 0,
          y: function(d) { return yScale(d.attribute) },
          width: w,
          height: yScale.rangeBand()
        });

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

      companies
        .attr('transform', 'translate(0,' + 0.5 * yScale.rangeBand() + ')');

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
        .attr('r', 1.3 * Math.sqrt(yScale.rangeBand()))
        .attr('cx', function(d) { return xScale(d.point.rating) })
        .attr('cy', function(d) { return yScale(d.point.attribute) });

      legendBG
        .attr({
          x: 0,
          y: 0,
          height: yScale.rangeBand(),
          width: w
        });

      legendItems
        .attr('transform', function (d) { return 'translate(' + (margin.left + legendScale(d)) + ',0)' })

      keyBGs
        .attr({
          width: legendScale.rangeBand(),
          height: yScale.rangeBand()
        });

      legendCircles
        .attr({
          cx: 0.4 * yScale.rangeBand(),
          cy: 0.5 * yScale.rangeBand(),
          r: 0.25 * yScale.rangeBand()
        });

      legendText
        .attr({
          x: yScale.rangeBand(),
          y: 0.5 * yScale.rangeBand(),
        });

    // End resize()
    };

  // End chart()
  };

  //============================================================================
  // Text wrapping function
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
