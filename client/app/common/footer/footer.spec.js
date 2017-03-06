import FooterModule from './footer';
import FooterComponent from './footer.component';
import FooterTemplate from './footer.html';

describe('Footer', () => {
  let $rootScope, $compile;

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(FooterModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
  }));

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<footer></footer>')(scope);
      scope.$apply();
    });


    it('has a text called support', () => {
      let footerElement = angular.element(template[0].querySelector('.footer'));
      expect(footerElement.html()).to.contain('SUPPORT');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = FooterComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(FooterTemplate);
    });
  });
});
