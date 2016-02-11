module.exports = function attributeChart(selection) {

  //============================================================================
  // Declare Variables
  var margin = {};
  var w;
  var h;
  var width;
  var height;

  // Scales
  var xScale = d3.scale.linear();
  var yScale = d3.scale.ordinal();
  var legendScale = d3.scale.ordinal();
  var color = d3.scale.ordinal().range(["#222", "#4C4C4C", "#DA291C", "#7E7E7E"]);

  // Axis Variables
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(10, '%')
    .tickPadding(10);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickPadding(10);

  //============================================================================
  // Load data and create chart
  //============================================================================
  d3.csv('/data/attributes', function(error, data) {
    scale();
    // companyNames and companyData set during chart.domain.create()
    // and used during subsequent element creation
    // Scale Domains
    var xValues = [];
    for (var i in data) { xValues = xValues.concat(d3.values(data[i]).slice(2)); }
    xScale.domain([Number(d3.min(xValues)) - 0.01, Number(d3.max(xValues)) + 0.01]);

    var yValues = ['legend1'];
    for (i in data) { yValues.push(data[i].attribute); }
    yScale.domain(yValues);

    companyNames = d3.keys(data[0]).filter(function(key) { return key !== 'attribute' & key !== 'order'; });
    color.domain(companyNames);
    legendScale.domain(companyNames);

    // Line data and legend domain
    companyData = companyNames.map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {attribute: d.attribute, rating: +d[name]};
        })
      };
    });

    // Create chart elements
    // chart.domain.create(data);
    var chartArea = chart.area.create(selection);
    chart.tooltipSelectors.create();
    chart.axis.create(chartArea);
    chart.lines.create(chartArea, companyData);
    chart.legend.create(chartArea, companyNames);
    chart.tooltips.create();

    // resize
    resize(1000);
    d3.select(window).on('resize', function() { resize(500); });

    // chartx(chartArea, data);
  });
  //============================================================================
  // Adjust scales based on window size
  //============================================================================
  function scale() {
    w = parseInt(selection.style('width'));
    h = parseInt(selection.style('height'));
    margin = { top: 0, right: 20, bottom: 30, left: w * 0.3 };
    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;

    xScale.range([0, width]);
    yScale.rangeBands([0, height]);
    legendScale.rangeBands([0, width]);
  }

  //============================================================================
  // Resize the chart
  //============================================================================
  function resize(duration, delay) {
    scale();
    duration = duration || 0;
    delay = delay || 0;
    chart.area.update(duration);
    chart.tooltipSelectors.update(duration);
    chart.axis.update(duration);
    chart.lines.update(duration);
    chart.legend.update();
  }

  //============================================================================
  // Chart elements
  //============================================================================
  var chart = {};
  // Create svg element and drawing area
  chart.area = {
    create: function(selection) {
      selection.attr('class', 'attributeChart');
      var svg = selection
        .append('svg')
          .attr({
            id: 'chartSVG',
            width: w + 'px',
            height: h + 'px'
          });

      // Tooltip selector group, needs to be added now for drawing order
      svg.append('g')
        .attr('id', 'tooltipSelectors');

      // Chart area
      return svg.append('g')
          .attr('id', 'chartArea')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      },
    update: function(duration) {
      d3.select('#chartSVG')
        .attr('width', w + 'px')
        .attr('height', h + 'px');

      d3.select('#chartArea')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    }
  };
  // Create tooltip selector rectangles
  chart.tooltipSelectors = {
    create: function() {
      d3.select('#tooltipSelectors')
        .selectAll('.tooltipSelector')
        .data(companyData[0].values)
        .enter()
        .append('rect')
        .attr('class', function(d, i) { return 'a' + i; })
        .attr({
          x: 0,
          y: function(d) { return yScale(d.attribute); },
          width: w,
          height: yScale.rangeBand()
      });
    },
    update: function(duration) {
      d3.selectAll('#tooltipSelectors rect')
        .attr({
          x: 0,
          y: function(d) { return yScale(d.attribute); },
          width: w,
          height: yScale.rangeBand()
        });
    }
  };
  // Axis
  chart.axis = {
    create: function(selection) {
      selection.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      selection.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    },
    update: function(duration) {
      xAxis.innerTickSize(0);
      yAxis.innerTickSize(-width);

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
    }
  };
  // Lines
  chart.lines = {
    create: function(selection, data) {
      var companies = selection.selectAll('.company')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'company')
        .attr('transform', 'translate(0,' + 0.5 * yScale.rangeBand() + ')');

      // Lines
      var line = d3.svg.line()
        .interpolate('linear')
        .x(function(d) { return xScale(d.rating); })
        .y(function(d) { return 0; });

      var lines = companies.append('path')
        .attr('class', 'line')
        .attr('d', function(d) { return line(d.values); })
        .style('stroke', function(d) { return color(d.name); });

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
        .attr('class', function(d, i) { return 'a' + i; })
        .attr('r',0)
        .attr('cx', function(d) { return xScale(d.point.rating); })
        .attr('cy', function(d) { return yScale(d.point.attribute); })
        .style('fill', function(d) { return color(d.name); });
    },
    update: function(duration) {
      d3.selectAll('.company')
        .attr('transform', 'translate(0,' + 0.5 * yScale.rangeBand() + ')');

      var line = d3.svg.line()
        .interpolate('linear')
        .x(function(d) { return xScale(d.rating); })
        .y(function(d) { return yScale(d.attribute); });

      d3.selectAll('.company .line')
        .attr('d', function(d) { return line(d.values); })
        .attr('stroke-dasharray', function() {
          len = this.getTotalLength();
          return len + ' ' + len;
        })
        .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
        .transition()
        .delay(duration * 2 / 21)
        .duration(duration * 2)
        .ease('linear')
        .attr('stroke-dashoffset', function() { return 0; });

      d3.selectAll('.company').selectAll('circle')
        .transition()
        .delay(function(d, i) { return (i-1) * duration * 2 / 21; })
        .duration(duration / 2)
        .attr('r', 1.3 * Math.sqrt(yScale.rangeBand()))
        .attr('cx', function(d) { return xScale(d.point.rating); })
        .attr('cy', function(d) { return yScale(d.point.attribute); });
    }
  };
  chart.legend = {
    create: function (selection, data) {
      var legend = d3.select('#chartSVG')
        .append('g')
        .attr('id', 'legend');

      legend
        .on('mouseover', function() {
          d3.selectAll('.tooltip')
            .style('opacity', 0);
        });

      var legendBG = legend.append('rect')
        .attr('class', 'legendBG');

      var legendItems = legend.selectAll('.legendItem')
        .data(companyNames)
        .enter()
        .append('g')
        .attr('class', 'legendItem')
        .attr('transform', function (d) { return 'translate(' + (margin.left + legendScale(d)) + ',0)'; });

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
        .style('fill', function (d) { return color(d); });

      var legendText = legendItems
        .append('text')
        .text(function (d) { return d; })
        .attr({
          class: 'legend',
          x: yScale.rangeBand(),
          y: 0.5 * yScale.rangeBand(),
          dy: '0.33em'
        });
    },
    update: function () {
      d3.select('.legendBG')
        .attr({
          x: 0,
          y: 0,
          height: yScale.rangeBand(),
          width: w
        });

      d3.selectAll('.legendItem')
        .attr('transform', function (d) { return 'translate(' + (margin.left + legendScale(d)) + ',0)'; });

      d3.selectAll('rect.legend')
        .attr({
          width: legendScale.rangeBand(),
          height: yScale.rangeBand()
        });

      d3.selectAll('circle.legend')
        .attr({
          cx: 0.4 * yScale.rangeBand(),
          cy: 0.5 * yScale.rangeBand(),
          r: 0.25 * yScale.rangeBand()
        });

      d3.selectAll('text.legend')
        .attr({
          x: yScale.rangeBand(),
          y: 0.5 * yScale.rangeBand(),
        });
    }
  };
  chart.tooltips = {
    create: function() {
      var seedData = d3.selectAll('circle.a0').data();
      var tooltips = d3.select('#chart')
        .selectAll('.tooltip')
        .data(seedData)
        .enter()
        .append('div')
        .attr('class', 'tooltip');

      // tooltips: position on mouseover
      d3.selectAll('#tooltipSelectors rect')
        .on('mouseover', function () {
          console.log('test');
          var thisClass = '.' + d3.select(this).attr('class');
          var thisData = d3.selectAll('circle' + thisClass)
            .data()
            .sort(function(a, b) {
              return a.point.rating - b.point.rating;
            });

          tooltips
            .data(thisData)
            .text(function(d) { return d3.format('%1')(d.point.rating); })
            .style('left', function(d) {
              thisWidth = parseInt(d3.select(this).style('height'));
              // return margin.left - 0.5*thisWidth + xScale(d.point.rating) + 'px'
              return margin.left + xScale(d.point.rating) + 'px';
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
    }
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
