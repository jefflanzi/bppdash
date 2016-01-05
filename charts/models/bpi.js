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
