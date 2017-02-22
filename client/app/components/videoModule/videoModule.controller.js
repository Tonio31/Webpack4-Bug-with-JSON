
class VideoController {
  constructor($log, $scope) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'VideoController' );

    this.$onInit = () => {
      $log.log('this.$onInit.data=', this.data);

      this.mediaInfo = {
        sources: [
          {
            src: this.data.source,
            type: 'video/mp4'
          }
        ],
        poster: this.data.poster
      };
    };

    // listen for the vjsVideoReady event
    $scope.$on('vjsVideoReady', (event, data) => {
      // data contains `id`, `vid`, `player` and `controlBar`
      $log.log('vjsVideoReady event was fired. event=', event, '  data.id=', data.id);
    });


    // listen for when the vjs-media object changes
    $scope.$on('vjsVideoMediaChanged', (event, data) => {
      $log.log('vjsVideoMediaChanged event was fired. event=', event, '  data=', data);
    });
  }
}

export default VideoController;
