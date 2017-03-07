import PageNotFoundModule from './pageNotFound';
import PageNotFoundController from './pageNotFound.controller';
import PageNotFoundComponent from './pageNotFound.component';
import PageNotFoundTemplate from './pageNotFound.html';

describe('PageNotFound', () => {
  let $rootScope, $componentController, $compile;

  beforeEach(window.module(PageNotFoundModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<page-not-found></page-not-found>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('Woops, sorry the page you tried to access does not exist');
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
