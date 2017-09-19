import AudioModuleModule from './audioModule';
import AudioModuleController from './audioModule.controller';
import AudioModuleComponent from './audioModule.component';
import AudioModuleTemplate from './audioModule.html';

describe('AudioModule', () => {
  let $rootScope, $componentController, $compile;
  let ngAudio;

  let audioDataBindings = {
    source: '\\/\\/dchai72lj2pqb.cloudfront.net\\/level-2\\/module-5\\/1+Minute+Basic+Breath+Meditation.mp3',
    title: 'The Title of my video',
  };


  let mockFilters = (value) => {
    return value;
  };

  let mockNgAudioObject = {
    audio: {
      paused: false,
      played: []
    },
    play: () => {
      mockNgAudioObject.audio.paused = false;
    },
    pause: () => {
      mockNgAudioObject.audio.paused = true;
    },
  };

  let spies = {
    ngAudio: {},
    mockNgAudioObject: {}
  };



  beforeEach(window.module(AudioModuleModule, ($provide) => {
    $provide.value('secondsToTimeFilter', mockFilters );
    $provide.value('translateFilter', mockFilters );
  }));


  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    ngAudio = $injector.get('ngAudio');


    spies.ngAudio.load = sinon.stub(ngAudio, 'load', () => {
      return mockNgAudioObject;
    });
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    let bindings = {
      data: audioDataBindings
    };
    beforeEach(() => {
      controller = $componentController('audioModule', {
        $scope: $rootScope.$new()
      }, bindings);

      controller.$onInit();
    });


    it('onInit() - Checks that we load the audio file during onInit', sinon.test( () => {
      expect(controller.userClickedPlay).to.equal(false);
      sinon.assert.calledWith(spies.ngAudio.load, audioDataBindings.source);
    } ));

    it('play() - Calls play for the first time', sinon.test( () => {
      spies.mockNgAudioObject.play = sinon.spy(mockNgAudioObject, 'play');
      controller.play();
      sinon.assert.called(spies.mockNgAudioObject.play);
      expect(controller.userClickedPlay).to.equal(true);
    } ));

    it('play() - Calls pause if user clicked on play before', sinon.test( () => {
      spies.mockNgAudioObject.pause = sinon.spy(mockNgAudioObject, 'pause');

      // Fake that the user click on play before
      controller.ngAudioObject.audio.paused = false;
      controller.ngAudioObject.audio.played.length = 2;

      controller.play();
      sinon.assert.called(spies.mockNgAudioObject.pause);
      expect(controller.userClickedPlay).to.equal(true);
    } ));
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.data = audioDataBindings;
      template = $compile('<audio-module data="data"></audio-module>')(scope);
      scope.$apply();
    });


    it('has a h3 title', () => {
      expect(template.find('h3').html()).to.contain(audioDataBindings.title);
    });


    it('play Button has css class icon-pause to start', () => {

      let playButton = angular.element(template[0].querySelector('.audio-big-play-button'));
      let playButtonTest = playButton[0];
      let className = playButtonTest.className;
      expect(className).to.contain('icon-play');


    });


    it('play Button calls play from controller and has css class icon-play & touched', () => {

      let playButton = angular.element(template[0].querySelector('.audio-big-play-button'));

      playButton.triggerHandler('click');
      scope.$apply();

      expect(playButton[0].className).to.contain('icon-pause');
      expect(playButton[0].className).to.contain('touched');

    });


  });

  describe('Component', () => {
    // component/directive specs
    let component = AudioModuleComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(AudioModuleTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(AudioModuleController);
    });
  });
});
