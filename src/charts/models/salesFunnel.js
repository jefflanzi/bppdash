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
