class SpiderChartController {
  constructor($log, $window, $timeout, $document, d3) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'SpiderChartController' );

    // chart size x/y
    let chartWidth = 450;
    let chartHeight = 450;

    let screenWidth = $window.innerWidth;
    if ( screenWidth <= 900 ) {
      chartWidth = screenWidth / 2;
      chartHeight = screenWidth / 2;
    }

    /* eslint-disable */
    // start spider library: https://github.com/alangrafu/radar-chart-d3
    let RadarChart = {
      defaultConfig: {
        containerClass: 'radar-chart',
        w: chartWidth,
        h: chartHeight,
        // @factor: Reduce the size of the whole chart. 1: Take 100% of the image space
        //                                              0: You see just a point in the middle
        factor: 0.8,
        // @factorLegend: Position of the label. 0: all labels are in the center of the spider
        //                                       1: Labels are positioned just at the edge of the spider
        factorLegend: 0.9,
        // @level: Number of spider circle lines
        levels: 5,
        // @maxValue: if one value on the spiderChart is bigger than maxValue (but < 100 otherwise it goes bezerk)
        //            it will be used as maximum value. For instance if maxValue is 10 and we have an item with value 50
        //            50 will be the max and will appear on the spiderChart like it is 100% (everything will be resized
        //            proportionally to 50 as the max)
        maxValue: 100,
        // @radians: number to indicate how much of a circle you want the spider area to be
        //            - 2 * Math.PI: full circle
        //            - Math.PI: half circle
        radians: 2 * Math.PI,
        color: d3.scale.category10(),
        // @axisLine: boolean - Hide/Show line from center to the label
        axisLine: true,
        // @axisText: boolean - Hide/Show labels
        axisText: true,
        // @circles: ????
        circles: true,
        // @radius: size of the small circles at the extremity of each value
        radius: 5,
        axisJoin: function(d, i) {
          return d.className || i;
        },
        transitionDuration: 300,
        open: true,

      },
      chart: function() {
        var cfg = Object.create(RadarChart.defaultConfig);
        function radar(selection) {
          selection.each(function(data) {
            var container = d3.select(this);
            data = data.map(function(datum) {
              if(datum instanceof Array) {
                datum = {axes: datum};
              }
              return datum;
            });

            let maxValue = Math.max(cfg.maxValue, d3.max(data, (d) => {
              return d3.max(d.axes, (o) => {
                return o.value;
              });
            }));

            var allAxis = data[0].axes.map(function(i, j){ return i.axis; });
            var total = allAxis.length;
            var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
            container.classed(cfg.containerClass, 1);
            function getPosition(i, range, factor, func){
              factor = typeof factor !== 'undefined' ? factor : 1;
              return range * (1 - factor * func(i * cfg.radians / total));
            }
            function getHorizontalPosition(i, range, factor){
              return getPosition(i, range, factor, Math.sin);
            }
            function getVerticalPosition(i, range, factor){
              return getPosition(i, range, factor, Math.cos);
            }
            var levelFactors = d3.range(0, cfg.levels).map(function(level) {
              return radius * ((level + 1) / cfg.levels);
            });
            var levelGroups = container.selectAll('g.level-group').data(levelFactors);
            levelGroups.enter().append('g');
            levelGroups.exit().remove();
            levelGroups.attr('class', function(d, i) {
              return 'level-group level-group-' + i;
            });
            var levelLine = levelGroups.selectAll('.level').data(function(levelFactor) {
              return d3.range(0, total).map(function() { return levelFactor; });
            });
            levelLine.enter().append('line');
            levelLine.exit().remove();
            levelLine
            .attr('class', 'level')
            .attr('x1', function(levelFactor, i){ return getHorizontalPosition(i, levelFactor); })
            .attr('y1', function(levelFactor, i){ return getVerticalPosition(i, levelFactor); })
            .attr('x2', function(levelFactor, i){ return getHorizontalPosition(i+1, levelFactor); })
            .attr('y2', function(levelFactor, i){ return getVerticalPosition(i+1, levelFactor); })
            .attr('transform', function(levelFactor) {
              return 'translate(' + (cfg.w/2-levelFactor) + ', ' + (cfg.h/2-levelFactor) + ')';
            });
            if(cfg.axisLine || cfg.axisText) {
              var axis = container.selectAll('.axis').data(allAxis);
              var newAxis = axis.enter().append('g');
              if(cfg.axisLine) {
                newAxis.append('line');
              }
              if(cfg.axisText) {
                newAxis.append('text');
              }
              axis.exit().remove();
              axis.attr('class', 'axis');
              if(cfg.axisLine) {
                axis.select('line')
                .attr('x1', cfg.w/2)
                .attr('y1', cfg.h/2)
                .attr('x2', function(d, i) { return getHorizontalPosition(i, cfg.w / 2, cfg.factor); })
                .attr('y2', function(d, i) { return getVerticalPosition(i, cfg.h / 2, cfg.factor); });
              }
              if(cfg.axisText) {
                axis.select('text')
                .attr('class', function(d, i){
                  var p = getHorizontalPosition(i, 0.5);
                  return 'legend ' +
                  ((p < 0.4) ? 'right' : ((p > 0.6) ? 'left' : 'middle'));
                })
                .attr('dy', function(d, i) {
                  var p = getVerticalPosition(i, 0.5);
                  return ((p < 0.1) ? '0.5em' : ((p > 0.9) ? '0' : '0.5em'));
                })
                .text(function(d) { return d; })
                .attr('x', function(d, i){ return getHorizontalPosition(i, cfg.w / 2, cfg.factorLegend); })
                .attr('y', function(d, i){ return getVerticalPosition(i, cfg.h / 2, cfg.factorLegend); });
              }
            }
            data.forEach(function(d){
              d.axes.forEach(function(axis, i) {
                axis.x = getHorizontalPosition(i, cfg.w/2, (parseFloat(Math.max(axis.value, 0))/maxValue)*cfg.factor);
                axis.y = getVerticalPosition(i, cfg.h/2, (parseFloat(Math.max(axis.value, 0))/maxValue)*cfg.factor);
              });
            });
            var polygon = container.selectAll(".area").data(data, cfg.axisJoin);
            polygon.enter().append('polygon')
            .classed({area: 1, 'd3-enter': 1})
            .on('mouseover', function (d){
              container.classed('focus', 1);
              d3.select(this).classed('focused', 1);
            })
            .on('mouseout', function(){
              container.classed('focus', 0);
              d3.select(this).classed('focused', 0);
            });
            polygon.exit()
            .classed('d3-exit', 1)
            .transition().duration(cfg.transitionDuration)
            .remove();
            polygon
            .each(function(d, i) {
              var classed = {'d3-exit': 0};
              classed['radar-chart-serie' + i] = 1;
              if(d.className) {
                classed[d.className] = 1;
              }
              d3.select(this).classed(classed);
            })
            .style('stroke', function(d, i) { return cfg.color(i); })
            .style('fill', function(d, i) { return cfg.color(i); })
            .transition().duration(cfg.transitionDuration)
            .attr('points',function(d) {
              return d.axes.map(function(p) {
                return [p.x, p.y].join(',');
              }).join(' ');
            })
            .each('start', function() {
              d3.select(this).classed('d3-enter', 0);
            });
            if(cfg.circles && cfg.radius) {
              var tooltip = container.selectAll('.tooltip').data([1]);
              tooltip.enter().append('text').attr('class', 'tooltip');
              var circleGroups = container.selectAll('g.circle-group').data(data, cfg.axisJoin);
              circleGroups.enter().append('g').classed({'circle-group': 1, 'd3-enter': 1});
              circleGroups.exit()
              .classed('d3-exit', 1)
              .transition().duration(cfg.transitionDuration).remove();
              circleGroups
              .each(function(d) {
                var classed = {'d3-exit': 0};
                if(d.className) {
                  classed[d.className] = 1;
                }
                d3.select(this).classed(classed);
              })
              .transition().duration(cfg.transitionDuration)
              .each('start', function() {
                d3.select(this).classed('d3-enter', 0);
              });
              var circle = circleGroups.selectAll('.circle').data(function(datum, i) {
                return datum.axes.map(function(d) { return [d, i]; });
              });
              circle.enter().append('circle')
              .classed({circle: 1, 'd3-enter': 1})
              .on('mouseover', function(d){
                tooltip
                .attr('x', d[0].x - 10)
                .attr('y', d[0].y - 5)
                .text(d[0].value)
                .classed('visible', 1);
                container.classed('focus', 1);
                container.select('.area.radar-chart-serie'+d[1]).classed('focused', 1);
              })
              .on('mouseout', function(d){
                tooltip.classed('visible', 0);
                container.classed('focus', 0);
                container.select('.area.radar-chart-serie'+d[1]).classed('focused', 0);
              });
              circle.exit()
              .classed('d3-exit', 1)
              .transition().duration(cfg.transitionDuration).remove();
              circle
              .each(function(d) {
                var classed = {'d3-exit': 0};
                classed['radar-chart-serie'+d[1]] = 1;
                d3.select(this).classed(classed);
              })
              .style('fill', function(d) { return cfg.color(d[1]); })
              .transition().duration(cfg.transitionDuration)
              .attr('r', cfg.radius)
              .attr('cx', function(d) {
                return d[0].x;
              })
              .attr('cy', function(d) {
                return d[0].y;
              })
              .each('start', function() {
                d3.select(this).classed('d3-enter', 0);
              });
              var tooltipEl = tooltip.node();
              tooltipEl.parentNode.appendChild(tooltipEl);
            }
          });
        }
        radar.config = function(value) {
          if(!arguments.length) {
            return cfg;
          }
          if(arguments.length > 1) {
            cfg[arguments[0]] = arguments[1];
          }
          else {
            d3.entries(value || {}).forEach(function(option) {
              cfg[option.key] = option.value;
            });
          }
          return radar;
        };
        return radar;
      },
      draw: function(id, d, options) {
        var chart = RadarChart.chart().config(options);
        var cfg = chart.config();
        d3.select(id).select('svg').remove();
        d3.select(id)
        .append("svg")
        .attr("width", cfg.w)
        .attr("height", cfg.h)
        .datum(d)
        .call(chart);
      }
    };
    // end spider library
    /* eslint-enable */

    this.$onInit = () => {
      this.userSpiderData = this.formatDataForSpider(this.block.data.set);
      $log.log('$onInit() - this.userSpiderData=', this.userSpiderData);
      let chart = RadarChart.chart();
      let cfg = chart.config();

      // have to setTimeout so dom has time to finish layout
      $timeout(() => {
        // set up chart
        let chartEl = angular.element($document[0].querySelector('.spider-chart'));

        if ( chartEl.length ) {
          let chartElWidth = chartEl[0].clientWidth;
          let svg = d3.select(`#chart-spider-${this.block.id}`).append('svg')
          .attr('width', `${chartElWidth}px`)
          .attr('height', chartHeight);
          svg.append('g')
          .attr('transform', `translate(${(chartElWidth / 2) - (chartWidth / 2)},0)`)
          .classed('single', 1)
          .datum(this.userSpiderData).call(chart);

          // when screen resizes update svg attributes
          angular.element($window).bind('resize', () => {
            chartElWidth = chartEl[0].clientWidth;
            svg.attr('width', `${chartElWidth}px`);
            d3.select(`#chart-spider-${this.block.id} svg g`)
            .attr('transform', `translate(${(chartElWidth / 2) - (chartHeight / 2)},0)`);
          });

          // add data and render chart
          // eslint-disable-next-line angular/module-getter
          chart.config({
            w: cfg.w / 4,
            h: cfg.h / 4,
            axisText: false,
            levels: 0,
            circles: false
          });
          cfg = chart.config();
        }

      }, 0);

    };

    this.formatDataForSpider = (ioDataSet) => {
      // For small screens, we don't have enough space to show the percentage, so we don't add it
      if ( screenWidth > 350 ) {
        ioDataSet[0].axes.forEach( (axe) => {
          axe.axis += ` (${axe.value}%)`;
        });
      }

      // There is a bug if the value is 100%, the chart just go crazy, so we fake it is 100%
      // As we still want to display the label as 100%, it's important to do this after assigning the value to the label
      ioDataSet[0].axes.forEach( (axe) => {
        if ( axe.value === '100' ) {
          axe.value = '99';
        }
      });

      return ioDataSet;
    };
  }
}

export default SpiderChartController;
