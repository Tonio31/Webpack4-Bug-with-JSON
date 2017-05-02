
class VideoController {
  constructor($log, $scope, $window) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'VideoController' );

    let ua = $window.navigator.userAgent;

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
            ui: false,
            // Default resolution [{Number}, 'low', 'high'], (low == the lower of the numbers in data.player.res)
            default: 'low',
            // Display dynamic labels or gear symbol
            dynamicLabel: true
          }
        },
        playbackRates: [ 0.5, 1.0, 2.0 ]
      };

      // basic check for mobile User Agent:
      if (ua.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i)) {
        $log.info('navigator is probably mobile - provide SD video by default');
        this.mediaOptions.plugins.videoJsResolutionSwitcher.default = 'low';
      }
      else {
        $log.info('navigator is probably desktop - provide HD video by default');
        this.mediaOptions.plugins.videoJsResolutionSwitcher.default = 'high';
      }

    };

    // listen for the vjsVideoReady event
    $scope.$on('vjsVideoReady', (event, data) => {

      // update the video object with the sources
      data.player.updateSrc([
        {
          src: this.data.source_sd,
          type: 'video/mp4',
          label: 'SD',
          res: '320'
        },
        {
          src: this.data.source_hd,
          type: 'video/mp4',
          label: 'HD',
          res: '720'
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
