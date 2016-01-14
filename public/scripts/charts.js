function attributeChart(selection) {

  //============================================================================
  // Function global variables
  var w = parseInt(selection.style('width'));
  var h = parseInt(selection.style('height'));
  var margin = { top: 0, right: 20, bottom: 30, left: w * 0.3 };
  var width = w - margin.left - margin.right;
  var height = h - margin.top - margin.bottom;

  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.ordinal().rangeRoundBands([0, height]);
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
  // Load data and call chart
  var data;
  d3.csv('/data/attributes.csv', function(d) {
    data = d;
    chart();
  });

  //============================================================================
  // Main chart funcion
  function chart() {

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
      .data(companies[0].values)
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
      .data(companies)
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
    // tooltips

    var seedData = d3.selectAll('circle.a0').data();
    var tooltips = d3.select('#chart')
      .selectAll('.tooltip')
      .data(seedData)
      .enter()
      .append('div')
      .attr('class', 'tooltip')
      .style('left', function(d) { return margin.left + xScale(d.point.rating) + 'px' })
      .style('top', function(d) {return yScale(d.point.attribute) - 0.5*yScale.rangeBand() + 'px' });

    // tooltipSelectors
    tooltipSelectors
      .on('mouseover', function () {
        var thisClass = '.' + d3.select(this).attr('class');
        var thisData = d3.selectAll('circle' + thisClass).data();

        tooltips
          .data(thisData)
          .text(function(d) { return d3.format('%1')(d.point.rating) })
          .style('left', function(d) { return margin.left - 10 + xScale(d.point.rating) + 'px' })
          .style('top', function(d) {return yScale(d.point.attribute) - 0.5*yScale.rangeBand() + 'px' });

        console.log(thisClass);
        console.log(thisData);
        console.log(tooltips);

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
      yScale.rangeRoundBands([0, height]);

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
        .attr('r', 8)
        .attr('cx', function(d) { return xScale(d.point.rating) })
        .attr('cy', function(d) { return yScale(d.point.attribute) });

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

function awarenessChart(selection) {

  // Global Variables
  var chart = {};
  var margin = {top: 10, right: 0, bottom: 50, left: 50};
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = parseInt(selection.style('height')) - margin.top - margin.bottom;

  // Scales
  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
  var yScale = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(10, "%");
    // .tickFormat(d3.format('%'));

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
    yScale.domain([0, 1]);

    // Create SVG and translated chart area g
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
        class: 'aided',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      });

    companies.append('rect')
      .attr({
        class: 'unaided',
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

    // Responsive resizing
    chart.resize(1000);
    d3.select(window).on('resize', function() { chart.resize(500); });

  // End chart.draw();
  };

  chart.resize = function resize(duration) {

    var duration = duration || 500;

    width = parseInt(selection.style('width')) - margin.left - margin.right;
    height = parseInt(selection.style('height')) - margin.top - margin.bottom;
    xScale.rangeRoundBands([0, width], .1);
    yScale.range([height, 0]);

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
};

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
    d3.csv('/data/jobTitles.csv', function(error, data) {
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
  d3.csv('/data/bpi.csv', function(error, data) {
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

function marketMap(selection) {
  // Define function variables
  var margin = { top: 20, right: 20, bottom: 30, left: 30 }
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = parseInt(selection.style('height')) - margin.top - margin.bottom;
  var markerSize = 20; // for company markers

  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.linear().range([0, height]);

  // Create SVG elements and bind data
  function chart() {
    // Draw SVG
    var chart = selection.append('svg')
    .attr({
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom
    })
    .append('g')
    .attr('id', 'chartArea')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Define Triangle Line Markers
    var def = chart.append('defs')
    var marker = def.append('marker')
    .attr({
      id: 'triangle',
      viewBox: '0 0 10 10',
      refX: 1,
      refY: 5,
      markerWidth: 6,
      markerHeight: 6,
      orient: 'auto'
    });
    var path = marker.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

    // Load data and draw chart
    d3.json('/data/factorMap.json', function(data) {

      // Define scales
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

      // Draw Factor Arrows
      var factorArrows = chart.selectAll('line.new')
      .data(data.factors)
      .enter()
      .append('line')
      .attr({
        class: 'factor',
        x2: function(d) { return xScale(d.x1) },
        y2: function(d) { return yScale(d.y1) },
        stroke: 'black',
        'stroke-width': 2,
        'marker-end': 'url(#triangle)'
      });

      // Create cluster groups
      var clusters = chart.selectAll('g.new')
        .data(data.clusters)
        .enter()
        .append('g')
        .attr('class', 'cluster');

      clusters.append('circle')
        .attr({
          id: function(d) { return d.id },
          class: 'clusterCircle',
          r: 0
        });

      clusters.append('text')
        .text(function(d) { return d.label })
        .attr({
          class: 'clusterText',
          'font-size': '0em',
          'text-anchor': 'middle'
        });

      // Create companies
      var companies = chart.selectAll('.company')
        .data(data.companies)
        .enter()
        .append('g')
        .attr('class', 'company');

      companies.append('rect')
        .attr({
          class: 'companyMarker',
          height: 0,
          width: 0
        });

      companies.append('text')
        .text(function(d) { return d.id })
        .attr({
          class: 'companyLabel',
          'font-size': '0em',
          'text-anchor': 'start',
          dx: '0.5em',
          dy: '1em'
        });

      companies.filter(function(d) { return d.class === 'client' })
        .classed('client', true)

      // Use resize for intro animation and responsive resizing
      resize(1000, 500);
      d3.select(window).on('resize', function() { resize(500, 0); });
      // End d3.json function
    });

    // Responsive Resizing
    function resize(duration, delay) {
      var duration = duration || 500;
      var delay = delay || 0;

      width = parseInt(selection.style('width')) - margin.left - margin.right;
      height = parseInt(selection.style('height')) - margin.top - margin.bottom;
      xScale.range([0, width]);
      yScale.range([0, height]);

      selection.select('svg')
        .transition()
        .duration(duration)
        .attr('width', width + margin.left + margin.right + 'px')
        .attr('height', height + margin.top + margin.bottom + 'px');

      d3.selectAll('.factor')
        .transition()
        .duration(duration)
        .attr({
          x1: function(d) { return xScale(d.x1) },
          x2: function(d) { return xScale(d.x2) },
          y1: function(d) { return yScale(d.y1) },
          y2: function(d) { return yScale(d.y2) }
        });

      d3.selectAll('.clusterCircle')
        .transition()
        .delay(delay * 1)
        .duration(duration)
        .attr({
          cx: function(d) { return xScale(d.cx) },
          cy: function(d) { return yScale(d.cy) },
          r: function(d) { return d.r }
        });

      d3.selectAll('.clusterText')
        .transition()
        .delay(delay * 1)
        .duration(duration)
        .attr({
          x: function(d) { return xScale(d.cx) },
          y: function(d) { return yScale(d.cy - d.r - 15) },
          'font-size': '1.2em'
        });

      d3.selectAll('.companyMarker').transition()
        .delay(delay * 2)
        .duration(duration * 0.75)
        .attr({
          x: function(d) { return xScale(d.x) },
          y: function(d) { return yScale(d.y) },
          height: markerSize + 'px',
          width: markerSize + 'px'
        });

      d3.selectAll('.companyLabel').transition()
        .delay(delay * 2)
        .duration(duration * 0.75)
        .attr({
          class: 'companyLabel',
          'font-size': '1em',
          x: function(d) { return xScale(d.x) + markerSize},
          y: function(d) { return yScale(d.y) }
        });
    // End resize()
    }

  // End chart()
  }

  return chart;
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
  var h = parseInt(selection.style('height'));
  var w = parseInt(selection.style('width'));
  var margin = {top: 0.05 * h, right: 20, bottom: 20, left: 20};
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = parseInt(selection.style('height')) - margin.top - margin.bottom;

  // Scales
  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
  var yScale = d3.scale.linear().range([height, 0]);
  var legendScale = d3.scale.ordinal().rangeRoundBands([0, width/2], 0.1);

  var dataset;
  d3.csv('/data/salesFunnel.csv', function(error, data) {
    dataset = data;
    chart();
  });

  // Create elements from data
  function chart() {
    // Set scale domains
    var xValues = [];
    dataset.forEach(function(d) { xValues.push(d.Company)});
    xScale.domain(xValues);
    yScale.domain([0,1]);

    // Create SVG and translated chart area g
    var chartArea = selection.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height',  height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Create legend
    var keys = ['awareness', 'consideration', 'preference', 'purchase']
    var values = d3.keys(dataset[0]).slice(1);
    legendScale.domain(keys)

    var legend = chartArea.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + margin.left + ',' + (-margin.top/2) + ')');

    var legendSeries = legend.selectAll('.series')
      .data(keys)
      .enter()
      .append('g')
      .attr('class', function(d) { return 'series ' + d })
      .attr('transform', function(d) { return 'translate(' + legendScale(d) + ',0)' })

    legendSeries.append('rect')
      .attr({
        class: function(d) { return 'legend ' + d },
        x: 0,
        y: -margin.top/4,
        width: legendScale.rangeBand(),
        height: margin.top/2
      })
      .style('opacity', '0');

    legendSeries.append('circle')
      .attr({
        class: function(d) { return 'legend ' + d },
        cx: 0,
        cy: 0,
        r: '0.75em'
      });

    legendSeries.append('text')
      .text(function(d, i) { return values[i] })
      .attr({
        class: function(d) { return 'legend ' + d },
        x: 0,
        y: 0,
        dx: '1.5em',
        dy: '0.32em'
      });

    // Create company groups and bars
    var companies = chartArea.selectAll('.company')
      .data(dataset)
      .enter()
      .append('g')
      .attr('class', 'company')
      .attr('transform', function(d) { return 'translate(' + xScale(d.Company) + ',0)' });

    var companybg = companies.append('rect')
      .attr('class', 'bar companyBG')
      .attr('width', xScale.rangeBand())
      .attr('height', 0)      

    var awareness = companies.append('rect')
      .attr({
        class: 'bar awareness',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      });

    var consideration = companies.append('rect')
      .attr({
        class: 'bar consideration',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      });

    var preference = companies.append('rect')
      .attr({
        class: 'bar preference',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      });

    var purchase = companies.append('rect')
      .attr({
        class: 'bar purchase',
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

    // Tooltip mouseovers
    d3.selectAll('.awareness')
      .on('mouseover', function() { showTooltip('.awareness', 'Awareness') })
      .on('mouseout', function() { hideTooltip('.awareness') });

    d3.selectAll('.consideration')
      .on('mouseover', function() { showTooltip('.consideration', 'Consideration') })
      .on('mouseout', function() { hideTooltip('.consideration') });

    d3.selectAll('.preference')
      .on('mouseover', function() { showTooltip('.preference', 'Preference') })
      .on('mouseout', function() { hideTooltip('.preference') });

    d3.selectAll('.purchase')
      .on('mouseover', function() { showTooltip('.purchase', 'Purchase Intent') })
      .on('mouseout', function() { hideTooltip('.purchase') });

    function showTooltip(series, value) {
      d3.selectAll(series)
        .classed('highlight', true);

      var m = xScale.rangeBand() * .05
      tooltips
        // .style('top', function(d) {return yScale(+d[value]) + 'px' })
        .style('bottom', function(d) {return height*1.01 + margin.bottom - yScale(+d[value]) + 'px' })
        .style('left', function(d) { return margin.left + xScale(d.Company) + m + 'px' })
        .style('width', xScale.rangeBand() * 0.9 + 'px')
        .classed('hidden', false)
        .text(function(d) { return d3.format('1%')(d[value]) });
    };

    function hideTooltip(series) {
      d3.selectAll(series).classed('highlight', false);
      tooltips.classed('hidden', true);
    };

    // Responsive resize
    resize(1000);
    d3.select(window).on('resize', function() { resize(350); });


  function resize(duration) {
    duration = duration || 500;
    w = parseInt(selection.style('width'))
    h = parseInt(selection.style('height'))
    margin.top = 0.05 * h;
    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;
    xScale.rangeRoundBands([0, width], 0.1);
    yScale.range([height, 0]);
    var lw;
    if (width > 900) {
      lw = width * 0.6;
    } else {
      lw = width;
    };
    legendScale.rangeRoundBands([0, lw], 0.1);

    // SVG element
    selection.select('svg')
      .transition()
      .duration(duration)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    chartArea
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    legend
      .attr('transform', 'translate(' + margin.left + ',' + (-margin.top/2) + ')');

    legendSeries
      .attr('transform', function(d) { return 'translate(' + legendScale(d) + ',0)' })

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
      .attr('y', function(d) { return yScale(d.Awareness) })
      .attr('width', xScale.rangeBand())
      .attr('height', function(d) { return height - yScale(d.Awareness) });

    consideration
      .transition()
      .delay(function(d, i) { return duration * 1.50 + i * 50 })
      .duration(duration)
      .attr('y', function(d) { return yScale(d.Consideration) })
      .attr('width', xScale.rangeBand())
      .attr('height', function(d) { return height - yScale(d.Consideration) });

    preference
      .transition()
      .delay(function(d, i) { return duration * 1.75 + i * 50 })
      .duration(duration)
      .attr('y', function(d) { return yScale(d.Preference) })
      .attr('width', xScale.rangeBand())
      .attr('height', function(d) { return height - yScale(d.Preference) });

    purchase
      .transition()
      .delay(function(d, i) { return duration * 2.0 + i * 50 })
      .duration(duration)
      .attr('y', function(d) { return yScale(d['Purchase Intent']) })
      .attr('width', xScale.rangeBand())
      .attr('height', function(d) { return height - yScale(d['Purchase Intent']) });

    labels
      .transition()
      .duration(duration)
      .attr('y', xScale.rangeBand() / 2);

  }

  // End chart()
  };

// End salesFunnel()
}
