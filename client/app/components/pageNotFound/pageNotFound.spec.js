/* eslint-disable camelcase */

import PageNotFoundModule from './pageNotFound';
import PageNotFoundController from './pageNotFound.controller';
import PageNotFoundComponent from './pageNotFound.component';
import PageNotFoundTemplate from './pageNotFound.html';

describe('PageNotFound', () => {
  let $rootScope, $componentController, $state, $compile;
  let Menu;
  let goSpy;
  let currentStepUrl = '/potentialife-course/cycle-1/module-1/step-1';

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(PageNotFoundModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    $state = $injector.get('$state');
    Menu = $injector.get('Menu');

    sinon.stub(Menu, 'getCurrentProgression').callsFake( () => {
      return {
        data: {
          current_step: {
            fullUrl: currentStepUrl
          }
        }
      };
    });

    sinon.stub(Menu, 'isMenuRetrieved').callsFake( () => {
      return true;
    });

    goSpy = sinon.spy($state, 'go');
  }));


  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
  }));

  describe('Controller', () => {
    // controller specs
    let controller;
    let stateParams = {
      intendedUrl: '/something'
    };
    beforeEach(() => {
      controller = $componentController('pageNotFound', {
        $scope: $rootScope.$new(),
        $stateParams: stateParams
      });
    });

    it('change state when we click on Resume Progress', () => {
      controller.resumeProgress();

      sinon.assert.calledWith(goSpy, currentStepUrl);
    });

    it('displayResumeProgress gets its value from Menu.isMenuRetrieved()', () => {
      expect(controller.displayResumeProgress).to.eq(true);
    });

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<page-not-found></page-not-found>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('WOOPS_UNEXPECTED');
      expect(template.find('h3').html()).to.eq('PAGE_DONT_EXIST');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = PageNotFoundComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(PageNotFoundTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(PageNotFoundController);
    });
  });
});
