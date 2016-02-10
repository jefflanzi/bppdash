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

  // // Resize
  // d3.select(window).on('load', function() {
  //   d3.select(window).on('resize', function() { resize(1,0) })
  // });


//==============================================================================
// Reusable Functions
  function resize(duration, delay) {
    duration = duration || 1000;
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
    duration = duration || 1000;
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
