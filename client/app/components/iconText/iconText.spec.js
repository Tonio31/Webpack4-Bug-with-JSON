import IconTextModule from './iconText';
import IconTextController from './iconText.controller';
import IconTextComponent from './iconText.component';
import IconTextTemplate from './iconText.html';

describe('IconText', () => {
  let $rootScope, $componentController, $compile;
  let Utility;

  let blocksBindingButton = {
    id: 51,
    type: 'static',
    element: 'icon_text',
    data: {
      icon: {
        type: 'icon-pl-lock',
        color: 'success'
      },
      text: '<h1>This content is locked!<\\/p>',
      button: {
        href: '/potentialife-course/cycle-1/module-1/step-9',
        color: 'primary',
        label: 'Resume your progress'
      }
    }
  };

  let blockbindingsNoButton = {
    id: 52,
    type: 'static',
    element: 'icon_text',
    data: {
      icon: {
        type: 'icon-pl-exclamation',
        color: 'alert'
      },
      text: '<p>If you see a button under this text, this is not normal, as there is no button provided in the JSON, we should not dispaly a button below.<\\/p>'
    }
  };


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
      scope.data = blocksBindingButton.data;
      scope.dataNoButton = blockbindingsNoButton.data;
      template = $compile('<icon-text data="data"></icon-text>')(scope);
      templateNoButton = $compile('<icon-text data="dataNoButton"></icon-text>')(scope);
      scope.$apply();
    });


    it('has a button displayed if button is present in Json', () => {
      let button = angular.element(template.find('button'));
      expect(button.length).to.eq(1);
      expect(template.find('button').html()).to.contain(blocksBindingButton.data.button.label);
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
