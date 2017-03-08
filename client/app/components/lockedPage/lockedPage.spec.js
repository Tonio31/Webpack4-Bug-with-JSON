import LockedPageModule from './lockedPage';
import LockedPageController from './lockedPage.controller';
import LockedPageComponent from './lockedPage.component';
import LockedPageTemplate from './lockedPage.html';

describe('LockedPage', () => {
  let $rootScope, $compile;

  beforeEach(window.module(LockedPageModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
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
      expect(template.find('h1').html()).to.eq('THIS PAGE IS LOCKED, YOU SHOULD NOT BE HERE');
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
