import IconTextModule from './iconText';
import IconTextController from './iconText.controller';
import IconTextComponent from './iconText.component';
import IconTextTemplate from './iconText.html';

describe('IconText', () => {
  let $rootScope, $state, $componentController, $compile;
  let goSpy;

  let blocksBinding = require('app/mockBackEndResponse/potentialife-course_cycle-1_module-1_step-7.json').blocks;


  let mockWindow = {
    location: {
      href: 'http://this-should-change.com'
    }
  };

  beforeEach(window.module(IconTextModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    $state = $injector.get('$state');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      controller = $componentController('iconText', {
        $scope: $rootScope.$new(),
        $window: mockWindow
      });

      goSpy = sinon.spy($state, 'go');
    });


    it('Redirect to external URL if url is of type http:// or https://', () => {

      let url = 'http://iamtestingifthisworks.com';
      controller.goToButtonLink(url);

      expect(mockWindow.location.href).to.eq(url);
    });


    it('Change State if the url is not an external URL', () => {

      let url = '/potentialife-course/cycle-1/module-1/step-9';
      controller.goToButtonLink(url);

      sinon.assert.calledWith(goSpy, url);
    });

  });

  describe('View', () => {
    // view specs
    let scope, template, templateNoButton;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.data = blocksBinding[1].data;
      scope.dataNoButton = blocksBinding[2].data;
      template = $compile('<icon-text data="data"></icon-text>')(scope);
      templateNoButton = $compile('<icon-text data="dataNoButton"></icon-text>')(scope);
      scope.$apply();
    });


    it('has a button displayed if button is present in Json', () => {
      let button = angular.element(template.find('button'));
      expect(button.length).to.eq(1);
      expect(template.find('button').html()).to.contain(blocksBinding[1].data.button.label);
    });


    it('DOESNT have a button displayed if button is NOT present in Json', () => {
      let button = angular.element(templateNoButton.find('button'));
      expect(button.length).to.eq(0);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = IconTextComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(IconTextTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(IconTextController);
    });
  });
});
