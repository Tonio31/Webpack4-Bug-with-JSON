
class VideoController {
  constructor( $log,
               $scope,
               Utility ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'VideoController' );

    const KEY_RES = `video-resolution`;

    const LOW_RES = 'low';
    const HIGH_RES = 'high';

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
            // Default resolution [{Number}, 'low', 'high'], (low = the lowest of the numbers in data.player.res)
            default: LOW_RES,
            // Display dynamic labels or gear symbol
            dynamicLabel: true
          }
        },
        playbackRates: [ 0.75, 1.0, 1.25, 1.5 ]
      };

      let userCustomResolution = Utility.getFromLocalStorage(KEY_RES);
      if ( userCustomResolution ) {
        $log.info(`User previously manually changed the resolution to ${userCustomResolution}`);
        this.mediaOptions.plugins.videoJsResolutionSwitcher.default = userCustomResolution;
      }

    };

    this.onResolutionChange = (iVideoPlayer) => {
      let resolution = iVideoPlayer.currentResolution();
      if ( resolution.label === 'SD' ) {
        Utility.saveToLocalStorage(KEY_RES, LOW_RES);
      }
      else if ( resolution.label === 'HD' ) {
        Utility.saveToLocalStorage(KEY_RES, HIGH_RES);
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
      data.player.on('resolutionchange', () => {
        this.onResolutionChange(data.player);
      });

      // This will prevent the user form right-click on the video (prevent form downloading easily)
      data.player.on('contextmenu', (e) => {
        e.preventDefault();
      });
    });

  }
}

export default VideoController;
