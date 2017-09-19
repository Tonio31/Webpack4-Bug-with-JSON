class AudioModuleController {
  constructor($log, ngAudio) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'AudioModuleController' );

    $log.log('constructor - START');

    this.ngAudioObject = null;
    this.userClickedPlay = false;

    this.$onInit = () => {

      $log.log( '$onInit() - data=', this.data );
      this.ngAudioObject = ngAudio.load(this.data.source); // returns NgAudioObject
    };

    this.play = () => {

      this.userClickedPlay = true;

      if ( this.ngAudioObject.audio.paused || this.ngAudioObject.audio.played.length === 0 ) {
        this.ngAudioObject.play();
      }
      else {
        this.ngAudioObject.pause();
      }

    };
  }
}

export default AudioModuleController;
