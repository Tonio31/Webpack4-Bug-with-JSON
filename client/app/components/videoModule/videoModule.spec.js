import VideoModule from './videoModule'
import VideoController from './videoModule.controller';
import VideoComponent from './videoModule.component';
import VideoTemplate from './videoModule.html';

describe('Video', () => {
  let $rootScope, $componentController, $compile;

  let videoDataBindings = {
      poster: "https://d2ahrnswp9nefw.cloudfront.net/videoplace.jpg",
      source: "https://d2ahrnswp9nefw.cloudfront.net/s.1.1/S1-1-1-new.mp4"
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
        sources: [{
            src: videoDataBindings.source,
            type: 'video/mp4'
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
      scope.data = videoDataBindings,
      template = $compile('<video-module data="data"></video-module>')(scope);
      scope.$apply();
    });
    
    it('it contains a video tag', () => {
      expect(template.find('video').html()).to.contain(videoDataBindings.source);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = VideoComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(VideoTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(VideoController);
      });
  });
});
