function attributeChart(selection) {

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
  var color = d3.scale.ordinal().range(["#222", "#4C4C4C", "#DA291C", "#7E7E7E"])

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
  // Load data and create chart
  //============================================================================
  d3.csv('/data/attributes', function(error, data) {
    scale();
    // companyNames and companyData set during chart.domain.create()
    // and used during subsequent element creation
    // Scale Domains
    var xValues = [];
    for (i in data) { xValues = xValues.concat(d3.values(data[i]).slice(2)); }
    xScale.domain([Number(d3.min(xValues)) - 0.01, Number(d3.max(xValues)) + 0.01]);

    var yValues = ['legend1'];
    for (i in data) { yValues.push(data[i].attribute) };
    yScale.domain(yValues);

    companyNames = d3.keys(data[0]).filter(function(key) { return key !== 'attribute' & key !== 'order'});
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
    d3.select(window).on('resize', function() { resize(500) });

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
    var duration = duration || 0;
    var delay = delay || 0;
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
  }
  // Create tooltip selector rectangles
  chart.tooltipSelectors = {
    create: function() {
      d3.select('#tooltipSelectors')
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
    },
    update: function(duration) {
      d3.selectAll('#tooltipSelectors rect')
        .attr({
          x: 0,
          y: function(d) { return yScale(d.attribute) },
          width: w,
          height: yScale.rangeBand()
        });
    }
  }
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
      xAxis.innerTickSize(0)
      yAxis.innerTickSize(-width)

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
  }
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
    },
    update: function(duration) {
      d3.selectAll('.company')
        .attr('transform', 'translate(0,' + 0.5 * yScale.rangeBand() + ')');

      var line = d3.svg.line()
        .interpolate('linear')
        .x(function(d) { return xScale(d.rating) })
        .y(function(d) { return yScale(d.attribute) });

      d3.selectAll('.company .line')
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

      d3.selectAll('.company').selectAll('circle')
        .transition()
        .delay(function(d, i) { return (i-1) * duration * 2 / 21 } )
        .duration(duration / 2)
        .attr('r', 1.3 * Math.sqrt(yScale.rangeBand()))
        .attr('cx', function(d) { return xScale(d.point.rating) })
        .attr('cy', function(d) { return yScale(d.point.attribute) });
    }
  }
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
        .attr('transform', function (d) { return 'translate(' + (margin.left + legendScale(d)) + ',0)' });

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
  }
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
    }
  }

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

function awarenessChart(selection) {

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
    dataset.forEach(function(d) { xValues.push(d.Company)});
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
      .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)' });

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
  };

  //============================================================================
  // Resize the chart elements when window resizes
  //============================================================================
  function resize(duration) {
    var duration = duration || 500;
    scale();

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
      .attr('y', function(d) { return yScale(d.Aided) })
      .attr('height', function(d) { return height - yScale(d.Aided) })
      .attr('width', xScale.rangeBand());

    d3.selectAll('.unaided')
      .transition()
      .delay(function(d, i) { return duration * 1.5 + i * 50 })
      .duration(duration)
      .attr('y', function(d) { return yScale(d.Unaided) })
      .attr('height', function(d) { return height - yScale(d.Unaided) })
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

function bpiChart(selection) {
  // Testing Variables
  var chart = {};

  // Global Variables
  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = parseInt(selection.style('height')) - margin.top - margin.bottom;

  // Scales
  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);
  var yScale = d3.scale.linear().range([0, height]);
  var cScale = d3.scale.ordinal()

  var dataset;
  d3.csv('/data/bpi', function(error, data) {
    dataset = data;
    chart.draw();
  });

  // Create elements from data
  chart.draw = function() {
    // Set scale domains
    var xValues = [];
    dataset.forEach(function(d) { xValues.push(d.Company)});
    xScale.domain(xValues);
    yScale.domain([0,100]);
    // Inner scale for companies
    cScale
      .rangeRoundBands([0, xScale.rangeBand()], .5)
      .domain(d3.range(3));

    // Create SVG and translated chart area g
    var chartArea = selection.append('svg')
      .attr({
        'width': width + margin.left + margin.right,
        'height': height + margin.top + margin.bottom
      })
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.left + ')');

    // Create company groups and bars
    var companies = chartArea.selectAll('.companies')
      .data(dataset)
      .enter()
      .append('g')
      .attr('class', 'company')
      .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)' });

    var companybgs = companies.append('rect')
      .attr({
        class: 'bgrect',
        x: 0,
        y: 0,
        height: 0,
        width: xScale.rangeBand()
      });

    var character = companies.append('rect')
      .attr({
        class: 'character',
        x: cScale(0),
        y: height,
        width: cScale.rangeBand() / 2,
        height: 0
      });

    var relationship = companies.append('rect')
      .attr({
        class: 'relationship',
        x: cScale(1),
        y: height,
        width: cScale.rangeBand() / 2,
        height: 0
      });

    var impact = companies.append('rect')
      .attr({
        class: 'impact',
        x: cScale(2),
        y: height,
        width: cScale.rangeBand() / 2,
        height: 0
      });

    var bpi = companies.append('circle')
      .attr({
        class: 'bpi',
        cx: 0,
        cy: 0,
        r: 0
      });

    var bpiLabel = companies.append('text')
      .text(function(d) { return d.BPI })
      .attr({
        class: 'bpiLabel',
        x: 0,
        'text-anchor': 'middle',
        y: 0,
        dy: '0.35em'
      });

    var companyLabel = companies.append('text')
      .text(function(d) { return d.Company} )
      .attr({
        class: 'bpiCompany',
        x: xScale.rangeBand() / 2,
        'text-anchor': 'middle',
        y: 0,
        dy: '2em'
      });

    // Responsive resize
    resize(1000); // Initial animations
    d3.select(window).on('resize', function() { resize(350) });

    function resize(duration) {
      var duration = duration || 500;

      width = parseInt(selection.style('width')) - margin.left - margin.right;
      height = parseInt(selection.style('height')) - margin.top - margin.bottom;

      xScale.rangeRoundBands([0, width], 0.05);
      yScale.range([0, height]);
      cScale.rangeRoundBands([0, xScale.rangeBand()], .5)

      // SVG element
      selection.select('svg')
        .transition()
        .duration(duration)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      companies
        .transition()
        .duration(duration)
        .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)' });

      companybgs
        .transition()
        .delay(function(d, i) { return i * 100} )
        .duration(duration)
        .attr({
          height: height,
          width: xScale.rangeBand()
        });

      character
        .transition()
        .delay(function(d, i ) { return duration + i * 100 })
        .duration(duration)
        .attr({
          x: cScale(0),
          y: function(d) { return height - yScale(+d['Character']) },
          width: cScale.rangeBand() / 2,
          height: function(d) { return yScale(+d.Character) }
        });

      relationship
        .transition()
        .delay(function(d, i ) { return duration + i * 100 })
        .duration(duration)
        .attr({
          x: cScale(1),
          y: function(d) { return height - yScale(+d['Customer Relationship']) },
          width: cScale.rangeBand() / 2,
          height: function(d) { return yScale(+d['Customer Relationship']) }
        });

      impact
        .transition()
        .delay(function(d, i ) { return duration + i * 100 })
        .duration(duration)
        .attr({
          x: cScale(2),
          y: function(d) { return height - yScale(+d['Impact']) },
          width: cScale.rangeBand() / 2,
          height: function(d) { return yScale(+d['Impact']) }
        });

      bpi
        .transition()
        .delay(function(d, i) { return 1.5 * duration + i * 100 })
        .duration(duration)
        .attr({
          cx: cScale(1) + cScale.rangeBand() / 4,
          cy: function(d) { return height - yScale(+d['BPI']) },
          r: cScale.rangeBand() * 0.7
        });

      bpiLabel
        .transition()
        .delay(function(d, i) { return 1.5 * duration + i * 100 })
        .duration(duration)
        .attr({
          x: cScale(1) + cScale.rangeBand() / 4,
          y: function(d) { return height - yScale(+d['BPI']) }
        });

      companyLabel
        .attr('x', xScale.rangeBand() / 2);

    // End resize();
    };

  // End chart.draw();
  };

// End bpiChart()
};

//==============================================================================
// Login Animation script
//==============================================================================
function loginGrid() {
  // Function variables
  var width;
  var height;
  var xScale = d3.scale.ordinal();
  var yScale = d3.scale.ordinal();
  var squareSize = 30
  var dataMatrix = []
  var chart = d3.select('body').append('svg');
  resize(1000, 1);

  // Display login form
  d3.select('div.login')
    .transition()
    .delay(1000)
    .duration(1000)
    .style('opacity', 1);

  // Resize
  d3.select(window).on('resize', function() { resize(1, 0) });

//==============================================================================
// Reusable Functions
  function resize(duration, delay) {
    var duration = duration || 1000;
    console.log('1 delay = ' + delay);
    getSizes();
    gridData();
    chart.attr({
      width: width,
      height: height
    });
    drawGrid(duration, delay);
  }
  // Get window size and adjust scales
  function getSizes() {
    width = window.innerWidth || document.documentElement.clientWidth;
    height = window.innerHeight || document.documentElement.clientHeight;

    xScale
      .domain(d3.range(Math.ceil(width / squareSize)))
      .rangeRoundBands([0, width]);

    yScale
      .domain(d3.range(Math.ceil(height / squareSize)))
      .rangeRoundBands([0, height])
  }

  // Generate data matrix for drawing squares
  function gridData() {
    xs = Math.ceil(width/squareSize);
    ys = Math.ceil(height/squareSize);

    for(var i = 0; i < ys; i++) {
      for(var j = 0; j < xs; j++) {
        dataMatrix.push({x: j * squareSize, y: i * squareSize});
      }
    }
  }

  function drawGrid(duration, delay) {
    var duration = duration || 1000;
    console.log(delay);
    chart.selectAll('.loginRect')
      .data(dataMatrix)
      .enter()
      .append('rect')
      .attr({
        x: function(d, i) { return d.x; },
        y: function(d, i) { return d.y; },
        width: 0,
        height: 0,
        class: 'loginRect'
      })
      .transition()
      .delay(function(d, i) { return delay * Math.sqrt(i) * 20 })
      .duration(duration)
      .attr({
        height: squareSize,
        width: squareSize
      });
  }

// End loginAnimate()
}

function marketMap(selection) {
  // Declare variables
  var margin = { top: 30, right: 30, bottom: 30, left: 30 };
  var width;
  var height;
  var markerSize = 20; // for company markers

  var xScale = d3.scale.linear();
  var yScale = d3.scale.linear();

  //============================================================================
  // Load data and create chart
  //============================================================================
  d3.json('/data/marketMap', function(error, data) {
    // Define scales
    scale();
    var cxMax = d3.max(data.clusters, function(d) { return Number(d.cx); });
    var fxMax = d3.max(data.factors, function(d) { return Number(d.x2); });
    var xMax = Math.max(cxMax, fxMax);
    var cxMin = d3.min(data.clusters, function(d) { return Number(d.cx); });
    var fxMin = d3.min(data.factors, function(d) { return Number(d.x2); });
    var xMin = Math.min(cxMin, fxMin);
    xScale.domain([xMin, xMax]);

    var cyMax = d3.max(data.clusters, function(d) { return Number(d.cy); });
    var fyMax = d3.max(data.factors, function(d) { return Number(d.y2); });
    var yMax = Math.max(cyMax, fyMax);
    var cyMin = d3.min(data.clusters, function(d) { return Number(d.cy); });
    var fyMin = d3.min(data.factors, function(d) { return Number(d.y2); });
    var yMin = Math.min(cyMin, fyMin);
    yScale.domain([yMin , yMax]);

    // Create Elements
    var chartArea = chart.area.create(selection);
    chart.marker.create(chartArea);
    chart.arrows.create(chartArea, data);
    chart.clusters.create(chartArea, data);
    chart.companies.create(chartArea, data);

    // Animate element intros
    resize(1000, 500);

    // Update on resize
    d3.select(window).on('resize', function() { resize(500, 0) });

  });



  //============================================================================
  // Adjust scales based on window size
  //============================================================================
  function scale() {
    width = parseInt(selection.style('width')) - margin.left - margin.right;
    height = parseInt(selection.style('height')) - margin.top - margin.bottom;

    xScale.range([0, width]);
    yScale.range([0, height]);

  }

  //============================================================================
  // Resize the chart
  //============================================================================
  function resize(duration, delay) {
    scale();
    var duration = duration || 0;
    var delay = delay || 0;
    chart.area.update();
    chart.arrows.update(duration);
    chart.clusters.update(duration, delay);
    chart.companies.update(duration, delay * 1.5);
  }
  //============================================================================
  // Chart elements
  //============================================================================
  var chart = {}
  chart.area = {
    create: function(selection) {
      return selection.append('svg')
        .attr({
          width: width + margin.left + margin.right + 'px',
          height: height + margin.top + margin.bottom + 'px'
        })
        .append('g')
          .attr('id', 'chartArea')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    },
    update: function() {
      d3.select('#chart svg')
        .attr('width', width + margin.left + margin.right + 'px')
        .attr('height', height + margin.top + margin.bottom + 'px');
    }
  }
  chart.marker = {
    create: function(selection) {
      selection
        .append('defs')
          .append('marker')
            .attr({
              id: 'triangle',
              viewBox: '0 0 10 10',
              refX: 1,
              refY: 5,
              markerWidth: 6,
              markerHeight: 6,
              orient: 'auto'
            })
            .append('path')
              .attr('d', 'M 0 0 L 10 5 L 0 10 z');
    }
  }
  chart.arrows = {
    create: function(selection, data) {
      selection.selectAll('.factor')
      .data(data.factors)
      .enter()
      .append('line')
        .attr({
          class: 'factor',
          x1: function(d) { return xScale(d.x1); },
          x2: function(d) { return xScale(d.x1); },
          y1: function(d) { return yScale(d.y1); },
          y2: function(d) { return yScale(d.y1); },
          stroke: 'black',
          'stroke-width': 2,
          'marker-end': 'url(#triangle)'
        });
    },
    update: function(duration) {
      d3.selectAll('.factor')
        .transition()
        .duration(duration)
        .attr({
          x1: function(d) { return xScale(+d.x1); },
          x2: function(d) { return xScale(+d.x2); },
          y1: function(d) { return yScale(+d.y1); },
          y2: function(d) { return yScale(+d.y2); }
        });
    }
  }
  chart.clusters = {
    create: function(selection, data) {
      var groups = selection.selectAll('.cluster')
        .data(data.clusters)
        .enter()
        .append('g')
          .attr('class', 'cluster')

      groups.append('circle')
          .attr({
            id: function(d) { return d.id },
            class: 'clusterCircle',
            r: 0
          });

      groups.append('text')
        .text(function(d) { return d.label })
        .attr({
          class: 'clusterText',
          'font-size': '0em',
          'text-anchor': 'middle'
        });
    },
    update: function(duration, delay) {
      d3.selectAll('.clusterCircle')
        .transition()
        .delay(delay)
        .duration(duration)
        .attr({
          cx: function(d) { return xScale(d.cx); },
          cy: function(d) { return yScale(d.cy); },
          r: function(d) { return d.r }
        });

      d3.selectAll('.clusterText')
        .transition()
        .delay(delay)
        .duration(duration)
        .attr({
          x: function(d) { return xScale(d.cx) },
          y: function(d) { return yScale(d.cy - d.r - 15) },
          'font-size': '1.2em'
        });
    }
  }
  chart.companies = {
    create: function(selection, data) {
      var companies = selection.selectAll('.company')
        .data(data.companies)
        .enter()
        .append('g')
          .attr('class', 'company');

      companies.append('rect')
        .attr({
          class: 'companyMarker',
          height: 0,
          width: 0,
        });

      companies.append('text')
        .text(function(d) { return d.id })
        .attr({
          class: 'companyLabel',
          'font-size': '0em',
          'text-anchro': 'start',
          dx: '0.5em',
          dy: '1em'
        });

      companies.filter(function(d) { return d.class === 'client' })
        .classed('client', true);
    },
    update: function(duration, delay) {
      d3.selectAll('.companyMarker').transition()
        .delay(delay)
        .duration(duration)
        .attr({
          x: function(d) { return xScale(d.x) },
          y: function(d) { return yScale(d.y) },
          height: markerSize + 'px',
          width: markerSize + 'px'
        });

      d3.selectAll('.companyLabel').transition()
        .delay(delay)
        .duration(duration)
        .attr({
          class: 'companyLabel',
          'font-size': '1em',
          x: function(d) { return xScale(d.x) + markerSize},
          y: function(d) { return yScale(d.y) }
        });
    }
  }

// End marketMap()
};

function pie(selection) {
  // Legends - http://bl.ocks.org/ZJONSSON/3918369
  // Global variables
  var selection = d3.select('#chart')
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
    .value(function(d) { return d.Percent} );

  // Chart area
  var svg = selection.append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  // Load dataset
  var dataset;
  d3.csv('/data/jobTitles.csv', type, function(error, data) {
    if (error) throw error;

    dataset = data;
    var g = svg.selectAll('.arc')
      .data(pie(dataset))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', function(d) { return color(d.data.Title) });

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
};

function salesFunnel(selection) {

  // Global Variables
  var h;
  var w;
  var margin;
  var width;
  var height;

  // Scales
  var xScale = d3.scale.ordinal();
  var yScale = d3.scale.linear();
  var legendScale = d3.scale.ordinal();

  var dataset;
  d3.csv('/data/salesFunnel', function(error, data) {
    dataset = data;
    scale();
    chart();
  });

  //============================================================================
  // Reusable Functions
  //============================================================================
  //============================================================================
  // Draw primary chart elements from data
  //============================================================================
  function chart() {
    // Set scale domains
    var xValues = [];
    dataset.forEach(function(d) { xValues.push(d.Company)});
    xScale.domain(xValues);
    yScale.domain([0,1]);

    // Create SVG and translated chart area g
    selection.attr('class', 'salesFunnel');
    var chartArea = selection.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height',  height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //==========================================================================
    // Create legend
    var keys = ['awareness', 'consideration', 'preference', 'purchase'];
    var displayText = {
      awareness: 'Awareness',
      consideration: 'Consideration',
      preference: 'Preference',
      purchase: 'Purchase Intent'
    }
    legendScale.domain(keys);

    var legend = chartArea.append('g')
      .attr('class', 'legend');

    var legendSeries = legend.selectAll('.series')
      .data(keys)
      .enter()
      .append('g')
      .attr('class', function(d) { return 'series ' + d })
      .attr('transform', function(d) { return 'translate(' + legendScale(d) + ',0)' })

    var legendBG = legendSeries.append('rect')
      .attr({
        class: function(d) { return d + ' legend interactive background' },
        x: 0,
        y: 0
      })
      .style('opacity', '0');

    var legendCircle = legendSeries.append('circle')
      .attr({
        class: function(d) { return d + ' legend interactive' },
        cx: 0,
        cy: 0
      });

    var legendText = legendSeries.append('text')
      .text(function(d, i) { return displayText[d] })
      .attr({
        class: function(d) { return d + ' legend' },
        dy: '0.33em'
      });

    //==========================================================================
    // Create company groups and bars
    var companies = chartArea.selectAll('.company')
      .data(dataset)
      .enter()
      .append('g')
      .attr('class', 'company')
      .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)' });

    var companybg = companies.append('rect')
      .attr('class', 'companyBG')
      .attr('width', xScale.rangeBand())
      .attr('height', 0)

    var awareness = companies.append('rect')
      .attr({
        class: 'awareness bar interactive',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      });

    var consideration = companies.append('rect')
      .attr({
        class: 'consideration bar interactive',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      });

    var preference = companies.append('rect')
      .attr({
        class: 'preference bar interactive',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      });

    var purchase = companies.append('rect')
      .attr({
        class: 'purchase bar interactive',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      });

    var labels = companies.append('text')
      .text(function(d) { return d.Company })
      .attr('transform', 'rotate(-90)')
      .attr({
        x: 0,
        dx: '-1em',
        y: xScale.rangeBand() / 2,
        dy: '0.35em'
      })
      .attr('text-anchor', 'end')
      .style('font-weight', 'bold')

    var tooltips = selection.selectAll('.tooltip')
      .data(dataset)
      .enter()
      .append('div')
      .attr('class', 'tooltip hidden');

    //==========================================================================
    // Tooltip mouseovers
    d3.selectAll('.interactive')
    .on('mouseover', function () {
      var thisClass = d3.select(this).attr('class').split(/\s+/)[0];
      d3.selectAll('.' + thisClass + '.interactive:not(.background)')
        .classed('highlight', true);
      d3.selectAll('.interactive:not(.' + thisClass + ')')
        .filter('*:not(.legend)')
        .style('opacity', 0.5);

      var m = xScale.rangeBand() * 0.05;
      tooltips
        .style('bottom', function(d) {return height*1.01 + margin.bottom - yScale(+d[thisClass]) + 'px' })
        .style('left', function(d) { return margin.left + xScale(d.Company) + m + 'px' })
        .style('width', xScale.rangeBand() * 0.9 + 'px')
        .classed('hidden', false)
        .text(function(d) { return d3.format('1%')(d[thisClass]) });
    })
    .on('mouseout', function() {
      var thisClass = '.' + d3.select(this).attr('class').split(/\s+/)[0];
      d3.selectAll(thisClass + '.interactive:not(.background)').classed('highlight', false);
      d3.selectAll('.interactive:not(' + thisClass + ')')
        .filter('*:not(.background)')
        .style('opacity', 1);
      tooltips.classed('hidden', true);
    });

    function hideTooltip(series) {
      d3.selectAll(series).classed('highlight', false);
      tooltips.classed('hidden', true);
    };

    // Responsive resize
    resize(1000);
    d3.select(window).on('resize', function() { resize(350); });

  //============================================================================
  // Resize the chart elements when window resizes
  //============================================================================
  function resize(duration) {
    duration = duration || 500;
    scale();

    // SVG element
    selection.select('svg')
      .transition()
      .duration(duration)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    chartArea
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    legend
      .attr('transform', 'translate(' + margin.left + ',' + (-margin.top) + ')');

    legendSeries
      .attr('transform', function(d) { return 'translate(' + legendScale(d) + ',0)' })

    legendBG
      .attr({
        width: legendScale.rangeBand(),
        height: margin.top
      });

    legendCircle
      .attr({
        cy: 0.5 * margin.top,
        r: 0.3 * margin.top
      });

    legendText
      .attr({
        x: 0.5 * margin.top,
        y: 0.5 * margin.top
      });

    companies
      .transition()
      .duration(duration)
      .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)' });

    companybg
      .transition()
      .duration(function(d, i) { return duration * 1.0 + i * 50 } )
      .attr('width', xScale.rangeBand())
      .attr('height', height);

    awareness
      .transition()
      .delay(function(d, i) { return duration * 1.25 + i * 50 })
      .duration(duration)
      .attr('y', function(d) { return yScale(d.awareness) })
      .attr('width', xScale.rangeBand())
      .attr('height', function(d) { return height - yScale(d.awareness) });

    consideration
      .transition()
      .delay(function(d, i) { return duration * 1.50 + i * 50 })
      .duration(duration)
      .attr('y', function(d) { return yScale(d.consideration) })
      .attr('width', xScale.rangeBand())
      .attr('height', function(d) { return height - yScale(d.consideration) });

    preference
      .transition()
      .delay(function(d, i) { return duration * 1.75 + i * 50 })
      .duration(duration)
      .attr('y', function(d) { return yScale(d.preference) })
      .attr('width', xScale.rangeBand())
      .attr('height', function(d) { return height - yScale(d.preference) });

    purchase
      .transition()
      .delay(function(d, i) { return duration * 2.0 + i * 50 })
      .duration(duration)
      .attr('y', function(d) { return yScale(d.purchase) })
      .attr('width', xScale.rangeBand())
      .attr('height', function(d) { return height - yScale(d.purchase) });

    labels
      .transition()
      .duration(duration)
      .attr('y', xScale.rangeBand() / 2);

  }

  // End chart()
  };

  //============================================================================
  // Adjust scales based on window size
  //============================================================================
  function scale() {
    w = parseInt(selection.style('width'));
    h = parseInt(selection.style('height'));
    margin = {top: 0.05 * h, right: 20, bottom: 20, left: 20};
    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;
    // Scales
    xScale.rangeRoundBands([0, width], 0.1);
    yScale.range([height, 0]);
    var lw = width > 900 ? 0.6 * width : width;
    legendScale.rangeRoundBands([0, lw], 0.1);
  }

// End salesFunnel()
}
