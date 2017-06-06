import wordCloudLayout from 'd3-cloud';

class WordCloudController {
  constructor($log, $window, $document, $timeout, d3) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'WordCloudController' );

    $log.log('constructor - START');

    /* eslint-disable */
    let wordCloudId, wordData;


    this.$onInit = () => {
      wordCloudId = `#word-cloud-${this.block.id}`;
      this.wordData = this.block.data.wordData;
      // this.wordId = `#word-cloud-${this.block.id}`; // not working - unknown

      $timeout(() => {
        let cloud = wordCloudLayout;
        let fill = d3.scale.ordinal()
        .domain([1, 100])
        .range([
          '#CD473D',
          '#B0F566' ,
          '#4AF2A1',
          '#5CC9F5',
          '#6638F0',
          '#F78AE0'
        ]);

        $log.warn('wordCloudId', wordCloudId);

        let layout = cloud()
        .size([500, 260])
        .words(this.wordData.map(function(d) {
          return {text: d.text, size: d.power * 3.3, test: 'haha'};
        }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2); })
        .font('Impact')
        .fontSize(function(d) { return d.size ; })
        .on('end', draw);
        function draw(words) {
          d3.select(wordCloudId).append('svg')
          .attr('width', layout.size()[0])
          .attr('height', layout.size()[1])
          .append('g')
          .attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
          .selectAll('text')
          .data(words)
          .enter().append('text')
          .style('font-size', function(d) { return d.size + 'px'; })
          .style('font-family', 'Impact')
          .style('fill', function(d, i) { return fill(i); })
          .attr('text-anchor', 'middle')
          .attr('transform', function(d) {
            return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
          })
          .text(function(d) { return d.text; });
        }
        layout.start();

      }, 100);
      /* eslint-enable */
    };



  }
}

export default WordCloudController;
