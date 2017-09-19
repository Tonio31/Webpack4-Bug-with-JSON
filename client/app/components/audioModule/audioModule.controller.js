class AudioModuleController {
  constructor($log, ngAudio) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'AudioModuleController' );

    $log.log('constructor - START');

    this.name = 'audioModule';

    this.currentProgress = 0;
    this.ngAudioObject = null;

    this.$doCheck = () => {

      $log.log( 'this.this.ngAudioObject=', this.ngAudioObject );
      $log.log( 'this.this.ngAudioObject.progress=', this.ngAudioObject.progress );

      if ( this.ngAudioObject.progress && this.currentProgress !== this.ngAudioObject.progress ) {
        this.currentProgress = Math.round(this.ngAudioObject.progress * 100) / 100;
        // this.progressStyle = {
        //   width: `${ Math.floor(this.currentProgress * 100) }%`
        // };
      }

    };

    this.test = () => {
      $log.log('test this.currentProgress=', this.currentProgress);
      this.ngAudioObject.progress = this.currentProgress;
    };

    this.$onInit = () => {

      $log.warn( 'this.data=', this.data );

      this.ngAudioObject = ngAudio.load(this.data.source); // returns NgAudioObject


      this.iconType = 'icon-play';
      this.progressStyle = {
        width: '0%'
      };
    };

    this.play = () => {

      $log.log('user click on button play/pause');

      if ( this.ngAudioObject.audio.paused || this.ngAudioObject.audio.played.length === 0 ) {
        $log.log('calls play progress=', this.ngAudioObject.progress);
        this.ngAudioObject.play();
        this.iconType = 'icon-pause';
      }
      else {
        $log.log('calls pause progress=', this.ngAudioObject.progress);
        this.ngAudioObject.pause();
        this.iconType = 'icon-play';
      }

    };
  }
}

export default AudioModuleController;
