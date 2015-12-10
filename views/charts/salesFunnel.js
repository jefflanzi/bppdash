function salesFunnel(selection) {

  // Global Variables
  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var width = parseInt(selection.style('width')) - margin.left - margin.right;
  var height = parseInt(selection.style('height')) - margin.top - margin.bottom;

  // Scales
  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
  var yScale = d3.scale.linear().range([height, 0]);

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
      // .style('background-color', '#E7E6E7')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.left + ')');

    // Background rect
    var background = chartArea.append('rect')
      .attr('class', 'background')
      .attr({width: width, height: height})
      .style('fill', '#E7E6E7');

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
      .style('fill', '#F2F2F2');

    var awareness = companies.append('rect')
      .attr({
        class: 'awareness',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      })
      .style('fill', '#222');

    var consideration = companies.append('rect')
      .attr({
        class: 'consideration',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      })
      .style('fill', '#4C4C4C');

    var preference = companies.append('rect')
      .attr({
        class: 'preference',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      })
      .style('fill', '#7E7E7E');

    var purchase = companies.append('rect')
      .attr({
        class: 'purchase',
        x: 0,
        y: height,
        width: xScale.rangeBand(),
        height: 0
      })
      .style('fill', '#AFAFAF');

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


    // Responsive resize
    resize(1000);
    d3.select(window).on('resize', function() { resize(350); });


  function resize(duration) {
    duration = duration || 500;

    width = parseInt(selection.style('width')) - margin.left - margin.right;
    height = parseInt(selection.style('height')) - margin.top - margin.bottom;
    xScale.rangeRoundBands([0, width], 0.1);
    yScale.range([height, 0]);

    // SVG element
    selection
      .transition()
      .duration(duration)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    background
      .transition()
      .duration(duration)
      .attr('width', width)
      .attr('height', height);

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
