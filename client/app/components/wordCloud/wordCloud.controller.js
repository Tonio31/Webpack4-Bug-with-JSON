import wordCloudLayout from 'd3-cloud';

class WordCloudController {
  constructor($log, $window, $document, $timeout, d3) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'WordCloudController' );

    $log.log('constructor - START');

    this.isWordCloudEmpty = true;

    this.$onInit = () => {

      this.isWordCloudEmpty = (this.block.data.wordData.length === 0);

      if ( !this.isWordCloudEmpty ) {
        let wordCloudId = `word-cloud-${this.block.id}`;
        this.wordData = this.block.data.wordData;

        $timeout(() => {

          let wordCloudIdWidth = $document[0].getElementById(wordCloudId).clientWidth;
          $log.log('wordCloudIdWidth=', wordCloudIdWidth);

          let cloud = wordCloudLayout;
          let fill = d3.scale.ordinal()
          .domain([ 1, 100 ])
          .range([
            '#CD473D',
            '#B0F566',
            '#4AF2A1',
            '#5CC9F5',
            '#6638F0',
            '#F78AE0'
          ]);

          let layout = cloud()
          .size([ wordCloudIdWidth, 300 ])
          .words(this.wordData.map((d) => {
            return { text: d.text, size: d.power * 3.3 };
          }))
          .padding(5)
          .rotate( () => { return ~~(Math.random() * 2); })
          .font('Impact')
          .fontSize( (d) => { return d.size; })
          .on('end', (words) => {
            d3.select(`#${wordCloudId}`).append('svg')
            .attr('width', layout.size()[0])
            .attr('height', layout.size()[1])
            .append('g')
            .attr('transform', `translate( ${layout.size()[0] / 2} , ${layout.size()[1] / 2} )`)
            .selectAll('text')
            .data(words)
            .enter().append('text')
            .style('font-size', (d) => { return `${d.size}px`; })
            .style('font-family', 'Impact')
            .style('fill', (d, i) => { return fill(i); })
            .attr('text-anchor', 'middle')
            .attr('transform', (d) => {
              return `translate(${[ d.x, d.y ]})rotate(${d.rotate})`;
            })
            .text((d) => { return d.text; });
          });


          layout.start();

        }, 100);
      }

    };



  }
}

export default WordCloudController;
