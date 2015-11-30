function marketMap(selection) {
  //- Define function variables
  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.linear().range([0, height]);

  //- Bind Data and Create Elements
  function chart() {
    //- Draw SVG
    var chart = selection.append('svg')
    .attr({
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom
    })
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //- Define Triangle Line Markers
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

    //- Load data and draw chart
    d3.json('/data/factorMap.json', function(factorData) {

      //- Define scales
      var cxMax = d3.max(factorData.clusters, function(d) { return Number(d.cx); });
      var fxMax = d3.max(factorData.factors, function(d) { return Number(d.x2); });
      var xMax = Math.max(cxMax, fxMax);
      var cxMin = d3.min(factorData.clusters, function(d) { return Number(d.cx); });
      var fxMin = d3.min(factorData.factors, function(d) { return Number(d.x2); });
      var xMin = Math.min(cxMin, fxMin);
      xScale.domain([xMin, xMax]);

      var cyMax = d3.max(factorData.clusters, function(d) { return Number(d.cy); });
      var fyMax = d3.max(factorData.factors, function(d) { return Number(d.y2); });
      var yMax = Math.max(cyMax, fyMax) + 100;
      var cyMin = d3.min(factorData.clusters, function(d) { return Number(d.cy); });
      var fyMin = d3.min(factorData.factors, function(d) { return Number(d.y2); });
      var yMin = Math.min(cyMin, fyMin);
      yScale.domain([yMin , yMax]);

      //- Draw Factor Arrows
      var factorArrows = chart.selectAll('line')
      .data(factorData.factors)
      .enter()
      .append('line')
      .attr({
        class: 'factor',
        x1: function(d) { return xScale(d.x1) },
        y1: function(d) { return yScale(d.y1) },
        x2: function(d) { return xScale(d.x1) },
        y2: function(d) { return yScale(d.y1) },
        stroke: 'black',
        'stroke-width': 2,
        'marker-end': 'url(#triangle)'
      });

      //- Draw Clusters
      var clusterCircles = chart.selectAll('circle')
      .data(factorData.clusters)
      .enter()
      .append('circle')
      .attr({
        class: 'clusterCircle',
        id: function(d) { return d.id; },
        cx: function(d) { return xScale(d.cx); },
        cy: function(d) { return yScale(d.cy); },
        r: 0
      })
      .on('mouseover', function(d) {
        var _this = d3.select(this)
        var xPosition = parseFloat(_this.attr('cx')) + d.r;
        var yPosition = parseFloat(_this.attr('cy')) - d.r;
        //- Update tooltip position and value
        d3.select('#tooltip')
        .style('left', xPosition + 'px')
        .style('top', yPosition + 'px')
        .select('#value')
        .text('x = ' + xPosition + ' y = ' + yPosition);
        //- Show the tooltip
        d3.select('#tooltip').classed('hidden', false);
      })
      .on('mouseout', function() {
        //- Hide the tooltip
        d3.select('#tooltip').classed('hidden', true);
      })
      .on("click", function(d) { console.log(d) })
      //- .on("mouseover", function() { d3.select(this).attr('fill', '#ffd02f'); })
      //- .on('mouseout', function() { d3.select(this).attr('fill', '#222'); })
      .transition()
      .delay(250)
      .duration(1000)
      .attr('r', function(d) { return d.r; });

      //- Draw Cluster Labels
      var clusterText = chart.selectAll('text')
      .data(factorData.clusters)
      .enter()
      .append('text')
      .text(function(d) { return d.label })
      .transition()
      .delay(500)
      .attr({
        x: function(d) { return xScale(d.cx) },
        y: function(d) { return yScale(d.cy - d.r - 10) },
        'text-anchor' : 'middle',
      });

      resize(250);
      d3.select(window).on('resize', function() { resize(500); });
      //- End d3.json function
    });

    //- Variable sizing and transitions

    //- Responsive Resizing
    function resize(duration) {
      var duration = duration || 500;

      width = parseInt(selection.style('width')) - margin.left - margin.right;
      xScale.range([0, width]);

      d3.select('#chart svg')
        .transition()
        .duration(duration)
        .attr('width', width + margin.left + margin.right + 'px');

      d3.selectAll('.factor')
        .transition()
        .duration(750)
        .attr({
          x2: function(d) { return xScale(d.x2) },
          y2: function(d) { return yScale(d.y2) }
        });

    }

  //- End function chart()
  }

  return chart;
  // End function marketMap()
}
