import HtmlModuleModule from './htmlModule';
import HtmlModuleController from './htmlModule.controller';
import HtmlModuleComponent from './htmlModule.component';
import HtmlModuleTemplate from './htmlModule.html';

describe('HtmlModule', () => {
  let $rootScope, $componentController, $compile;

  let dataBlock = {
    config: {
      bgColor: 'dark-grey'
    },
    value: '<h1>Block: HTML with background</h1><p>This is a HTML block with a personalised background</p>'
  };

  beforeEach(window.module(HtmlModuleModule));

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
      data: dataBlock
    };

    beforeEach(() => {
      controller = $componentController('htmlModule', {
        $scope: $rootScope.$new()
      }, bindings);
    });


    it('getBackGroundColour() returns the cool css class', () => {
      expect(controller.getBackGroundColour()).to.eq(`bgcolour-${dataBlock.config.bgColor}`);
    });
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.data = dataBlock;
      template = $compile('<html-module data="data"></html-module>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('Block: HTML with background');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = HtmlModuleComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(HtmlModuleTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(HtmlModuleController);
    });
  });
});
