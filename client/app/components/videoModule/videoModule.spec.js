import VideoModule from './videoModule';
import VideoController from './videoModule.controller';
import VideoComponent from './videoModule.component';
import VideoTemplate from './videoModule.html';

describe('Video', () => {
  let $rootScope, $componentController, $compile;

  let videoDataBindings = {
    poster: 'https:\/\/dchai72lj2pqb.cloudfront.net\/level-1\/module-1\/video-3\/l01_m01_v03_poster.jpg',
    source_sd: 'https:\/\/dchai72lj2pqb.cloudfront.net\/level-1\/module-1\/video-3\/L01_M01_V3_weblo.mp4',
    caption_label: 'caption_label',
    caption_src: 'https:\/\/dchai72lj2pqb.cloudfront.net\/level-1\/module-1\/video-3\/l01_m01_v03_text.vtt',
    caption_lang: 'caption_lang',
    caption_default: 'caption_default'
  };

  beforeEach(window.module(VideoModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    let bindings = {
      data: videoDataBindings
    };
    beforeEach(() => {
      controller = $componentController('videoModule', {
        $scope: $rootScope.$new()
      }, bindings);

      controller.$onInit();
    });


    it('has a mediaInfo property', () => {
      expect(controller).to.have.property('mediaInfo');
    });

    it('media info to be populated with the bindings form data', () => {

      let expectedMediaInfo = {

        tracks: [
          {
            kind: 'subtitles',
            label: videoDataBindings.caption_label,
            src: videoDataBindings.caption_src,
            srclang: videoDataBindings.caption_lang,
            default: videoDataBindings.caption_default
          }
        ],
        poster: videoDataBindings.poster
      };

      expect(controller.mediaInfo).to.deep.eq(expectedMediaInfo);
    });

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.data = videoDataBindings;
      template = $compile('<video-module data="data"></video-module>')(scope);
      scope.$apply();
    });

    it('it contains a video tag', () => {
      let video = angular.element(template[0].querySelector('.vjs-tech'));
      expect(video.length).to.eq(1);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = VideoComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(VideoTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(VideoController);
    });
  });
});
