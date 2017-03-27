import IconTextModule from './iconText';
import IconTextController from './iconText.controller';
import IconTextComponent from './iconText.component';
import IconTextTemplate from './iconText.html';

describe('IconText', () => {
  let $rootScope, $componentController, $compile;
  let Utility;

  let blocksBinding = require('app/mockBackEndResponse/potentialife-course_cycle-3_module-31_step-4.json').blocks;


  beforeEach(window.module(IconTextModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    Utility = $injector.get('Utility');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      controller = $componentController('iconText', {
        $scope: $rootScope.$new()
      });
    });

    it('Redirect to external URL if url is of type http:// or https://', sinon.test( () => {
      let goToLinkSpy = sinon.spy(Utility, 'goToLink');
      controller.goToButtonLink('whatever');

      sinon.assert.calledWith(goToLinkSpy, 'whatever');
    }));
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
