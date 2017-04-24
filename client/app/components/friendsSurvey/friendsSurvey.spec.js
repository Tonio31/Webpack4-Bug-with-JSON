import FriendsSurveyModule from './friendsSurvey';
import FriendsSurveyController from './friendsSurvey.controller';
import FriendsSurveyComponent from './friendsSurvey.component';
import FriendsSurveyTemplate from './friendsSurvey.html';

describe('FriendsSurvey', () => {
  let $rootScope, $componentController, $compile;

  beforeEach(window.module(FriendsSurveyModule));

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
      controller = $componentController('friendsSurvey', {
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
      template = $compile('<friends-survey></friends-survey>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('friendsSurvey');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = FriendsSurveyComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(FriendsSurveyTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(FriendsSurveyController);
    });
  });
});
