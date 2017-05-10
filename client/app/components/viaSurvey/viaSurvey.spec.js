import ViaSurveyModule from './viaSurvey';
import ViaSurveyController from './viaSurvey.controller';
import ViaSurveyComponent from './viaSurvey.component';
import ViaSurveyTemplate from './viaSurvey.html';

describe('ViaSurvey', () => {
  let $rootScope, $componentController, $compile;

  beforeEach(window.module(ViaSurveyModule));

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
      controller = $componentController('viaSurvey', {
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
      template = $compile('<via-survey></via-survey>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('viaSurvey');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = ViaSurveyComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(ViaSurveyTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ViaSurveyController);
    });
  });
});
