//==============================================================================
// Login Animation script
//==============================================================================
function loginAnimate() {

  var width = window.innerWidth || document.documentElement.clientWidth;
  var height = window.innerHeight || document.documentElement.clientHeight;
  //- console.log(width);
  //- console.log(height);
  var body = d3.select('body');

  var chart = body.append('svg')
    .attr({
      width: width,
      height: height
    })
    .style('border', 'none');

  var squareSize = 30

  var xScale = d3.scale.ordinal()
    .domain(d3.range(Math.ceil(width / squareSize)))
    .rangeRoundBands([0, width])

  var yScale = d3.scale.ordinal()
    .domain(d3.range(Math.ceil(height / squareSize)))
    .rangeRoundBands([0, height])

  xs = Math.ceil(width/squareSize);
  ys = Math.ceil(height/squareSize);

  var dataMatrix = []
  for(var i = 0; i < ys; i++) {
    for(var j = 0; j < xs; j++) {
      dataMatrix.push({x: j * squareSize, y: i * squareSize});
    }
  }

  var grid = chart.selectAll('rect')
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
    .delay(function(d, i) { return Math.sqrt(i) * 20})
    .duration(1000)
    .attr({
      height: squareSize,
      width: squareSize
    });

  d3.select('div.login')
    .transition()
    .delay(1000)
    .duration(1000)
    .style('opacity', 1);

  function resize(duration) {
    duration == duration || 500;
    var width = window.innerWidth || document.documentElement.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight;

    

  }

// End loginAnimate()
}
