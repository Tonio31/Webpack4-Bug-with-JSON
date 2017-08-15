import ButtonModuleModule from './buttonModule';
import ButtonModuleController from './buttonModule.controller';
import ButtonModuleComponent from './buttonModule.component';
import ButtonModuleTemplate from './buttonModule.html';

describe('ButtonModule', () => {
  let $rootScope, $componentController, $compile;

  let Utility, PdfGenerator;

  let buttonBlock = {
    id: 21,
    type: 'dynamic',
    element: 'button',
    data: {
      href: '/potentialife-course/cycle-1/module-1/step-9',
      color: 'primary',
      label: 'Resume your progress',
      position: 'center'
    }
  };

  let spies = {
    Utility: {},
    PdfGenerator: {}
  };

  beforeEach(window.module(ButtonModuleModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    Utility = $injector.get('Utility');
    PdfGenerator = $injector.get('PdfGenerator');
  }));

  describe('Controller', () => {
    // controller specs
    let controller;
    let bindings = {
      block: angular.fromJson(angular.toJson(buttonBlock)) // Deep Cloning
    };
    beforeEach(() => {
      controller = $componentController('buttonModule', {
        $scope: $rootScope.$new()
      }, bindings);
      controller.$onInit();
    });


    it('goToButtonLink calls Utility.goToLink() for non-PDF links', sinon.test( () => {

      spies.Utility.goToLink = sinon.spy(Utility, 'goToLink');

      // type is undefined here, it can happens as we introduced button type after it was created
      controller.goToButtonLink(buttonBlock.data.type);

      sinon.assert.calledWith(spies.Utility.goToLink, buttonBlock.data.href);
    }));


    it('goToButtonLink calls PdfGenerator.generatePDF() for PDF links', sinon.test( () => {

      spies.PdfGenerator.generatePDF = sinon.spy(PdfGenerator, 'generatePDF');
      controller.goToButtonLink('pdf');

      sinon.assert.calledWith(spies.PdfGenerator.generatePDF, buttonBlock.data.href);
    }));

    it('getPositionClass build correct class from input', sinon.test( () => {
      expect(controller.getPositionClass()).to.eq('button-center');
    }));

    it('getPositionClass returns empty string if position is undefined', sinon.test( () => {
      delete controller.data.position;
      expect(controller.getPositionClass()).to.eq('');
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
      expect(buttonModule.hasClass('button-center')).to.eq(true);

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
