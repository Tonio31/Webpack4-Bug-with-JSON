/* eslint-disable camelcase */

import LockedPageModule from './lockedPage';
import LockedPageController from './lockedPage.controller';
import LockedPageComponent from './lockedPage.component';
import LockedPageTemplate from './lockedPage.html';

describe('LockedPage', () => {
  let $rootScope, $compile;
  let Menu;
  let currentStepUrl = '/potentialife-course/cycle-1/module-1/step-1';

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(LockedPageModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
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
  }));


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
