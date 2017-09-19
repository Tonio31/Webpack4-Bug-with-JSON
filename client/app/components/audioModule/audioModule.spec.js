import AudioModuleModule from './audioModule';
import AudioModuleController from './audioModule.controller';
import AudioModuleComponent from './audioModule.component';
import AudioModuleTemplate from './audioModule.html';

describe('AudioModule', () => {
  let $rootScope, $componentController, $compile;

  beforeEach(window.module(AudioModuleModule));

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
    beforeEach(() => {
      controller = $componentController('audioModule', {
        $scope: $rootScope.$new()
      });
    });


    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      expect(controller).to.have.property('name');
    });
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<audio-module></audio-module>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('audioModule');
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
