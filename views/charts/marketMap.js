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
    .style('background-color', '#E2E2E2')
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
}
