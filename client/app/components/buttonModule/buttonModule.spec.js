import ButtonModuleModule from './buttonModule';
import ButtonModuleController from './buttonModule.controller';
import ButtonModuleComponent from './buttonModule.component';
import ButtonModuleTemplate from './buttonModule.html';

describe('ButtonModule', () => {
  let $rootScope, $componentController, $compile;
  let Utility;

  let goToLinkSpy;

  let buttonBlock = {
    id: 21,
    type: 'dynamic',
    element: 'button',
    data: {
      href: '/potentialife-course/cycle-1/module-1/step-9',
      color: 'primary',
      label: 'Resume your progress',
      position: 'btn-center'
    }
  };

  beforeEach(window.module(ButtonModuleModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    Utility = $injector.get('Utility');
  }));

  describe('Controller', () => {
    // controller specs
    let controller;
    let bindings = {
      block: buttonBlock
    };
    beforeEach(() => {
      controller = $componentController('buttonModule', {
        $scope: $rootScope.$new()
      }, bindings);
    });


    it('goToButtonLink calls Utility.goToLink()', sinon.test( () => { // erase if removing this.name from the controller

      goToLinkSpy = sinon.spy(Utility, 'goToLink');
      controller.goToButtonLink('whatever');

      sinon.assert.calledWith(goToLinkSpy, 'whatever');
    }));
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = buttonBlock;
      template = $compile('<button-module block="block"></button-module>')(scope);
      scope.$apply();
    });


    it('Has the good css classes depending on input', () => {
      let buttonModule = angular.element(template[0].querySelector('.button-module'));
      expect(buttonModule.hasClass('btn-center')).to.eq(true);

      expect(template.find('button').hasClass('primary')).to.eq(true);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = ButtonModuleComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(ButtonModuleTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ButtonModuleController);
    });
  });
});
