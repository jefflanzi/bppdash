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
      // .style('background-color', '#E7E6E7')
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
      .style('fill', '#F2F2F2');

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
