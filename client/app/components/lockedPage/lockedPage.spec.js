/* eslint-disable camelcase */

import LockedPageModule from './lockedPage';
import LockedPageController from './lockedPage.controller';
import LockedPageComponent from './lockedPage.component';
import LockedPageTemplate from './lockedPage.html';

describe('LockedPage', () => {
  let $rootScope, $componentController, $state, $compile;
  let Menu;
  let goSpy;
  let currentStepUrl = '/potentialife-course/cycle-1/module-1/step-1';

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(LockedPageModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    $state = $injector.get('$state');
    Menu = $injector.get('Menu');

    sinon.stub(Menu, 'getCurrentProgression', () => {
      return {
        data: {
          current_step: {
            fullUrl: currentStepUrl
          }
        }
      };
    });


    goSpy = sinon.spy($state, 'go');
  }));

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      controller = $componentController('lockedPage', {
        $scope: $rootScope.$new()
      });
    });

    it('change state when we click on Resume Progress', sinon.test( () => {
      controller.resumeProgress();

      sinon.assert.calledWith(goSpy, currentStepUrl);
    }));

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<locked-page></locked-page>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('CONTENT_LOCKED');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = LockedPageComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(LockedPageTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(LockedPageController);
    });
  });
});
