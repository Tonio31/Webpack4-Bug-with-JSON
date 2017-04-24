
class VideoController {
  constructor($log, $scope) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'VideoController' );



    this.$onInit = () => {


      this.mediaInfo = {
        // dont need the sources property because the resolution-change plugin deals with the source (sd & hd)
        tracks: [
          {
            kind: 'subtitles',
            label: this.data.caption_label,
            src: this.data.caption_src,
            srclang: this.data.caption_lang,
            default: this.data.caption_default
          }
        ],
        poster: this.data.poster
      };

      this.mediaOptions = {
        plugins: {
          videoJsResolutionSwitcher: {
            ui: true,
            default: 'low', // Default resolution [{Number}, 'low', 'high'],
            dynamicLabel: true // Display dynamic labels or gear symbol
          }
        }
      };

    };

    // listen for the vjsVideoReady event
    $scope.$on('vjsVideoReady', (event, data) => {

      // update the video object with the sources
      data.player.updateSrc([
        {
          src: this.data.source_sd,
          type: 'video/mp4',
          label: 'SD',
          res: '360'
        },
        {
          src: this.data.source_hd,
          type: 'video/mp4',
          label: 'HD',
          res: '1080'
        }
      ]);

      // callback after resolution switched
      // eslint-disable-next-line prefer-arrow-callback
      data.player.on('resolutionchange', () => {
        $log.info('Source changed to %s', data.player.src());
      });

    });

  }
}

export default VideoController;
