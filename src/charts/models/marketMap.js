module.exports = function marketMap(selection) {
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
    d3.select(window).on('resize', function() { resize(500, 0); });

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
    duration = duration || 0;
    delay = delay || 0;
    chart.area.update();
    chart.arrows.update(duration);
    chart.clusters.update(duration, delay);
    chart.companies.update(duration, delay * 1.5);
  }
  //============================================================================
  // Chart elements
  //============================================================================
  var chart = {};
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
  };
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
  };
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
  };
  chart.clusters = {
    create: function(selection, data) {
      var groups = selection.selectAll('.cluster')
        .data(data.clusters)
        .enter()
        .append('g')
          .attr('class', 'cluster');

      groups.append('circle')
          .attr({
            id: function(d) { return d.id; },
            class: 'clusterCircle',
            r: 0
          });

      groups.append('text')
        .text(function(d) { return d.label; })
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
          r: function(d) { return d.r; }
        });

      d3.selectAll('.clusterText')
        .transition()
        .delay(delay)
        .duration(duration)
        .attr({
          x: function(d) { return xScale(d.cx); },
          y: function(d) { return yScale(d.cy - d.r - 15); },
          'font-size': '1.2em'
        });
    }
  };
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
        .text(function(d) { return d.id; })
        .attr({
          class: 'companyLabel',
          'font-size': '0em',
          'text-anchro': 'start',
          dx: '0.5em',
          dy: '1em'
        });

      companies.filter(function(d) { return d.class === 'client'; })
        .classed('client', true);
    },
    update: function(duration, delay) {
      d3.selectAll('.companyMarker').transition()
        .delay(delay)
        .duration(duration)
        .attr({
          x: function(d) { return xScale(d.x); },
          y: function(d) { return yScale(d.y); },
          height: markerSize + 'px',
          width: markerSize + 'px'
        });

      d3.selectAll('.companyLabel').transition()
        .delay(delay)
        .duration(duration)
        .attr({
          class: 'companyLabel',
          'font-size': '1em',
          x: function(d) { return xScale(d.x) + markerSize; },
          y: function(d) { return yScale(d.y); }
        });
    }
  };

// End marketMap()
};
