import NavbarModule from '../navbar';

describe('Navbar MenuItem Directive', () => {
  let $rootScope, $compile, ZendeskWidget;

  let menuJson = require('app/mockBackEndResponse/51/menu.json');

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(NavbarModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
    $provide.value('ZendeskWidget', ZendeskWidget );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
  }));

  describe('Entire Menu <menu-item></menu-item>', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.menu = menuJson.menudata[0];

      let offCanvasWrapCtrl = {
        hide: () => {}
      };

      sinon.spy(offCanvasWrapCtrl, 'hide');

      let element = angular.element('<div><menu-item item="menu"></menu-item></div>');
      element.data('$offCanvasWrapController', offCanvasWrapCtrl);

      template = $compile(element)(scope);
      scope.$apply();
    });

    it('Count the number of tags that have the class has-submenu', () => {
      let hasSubMenuTags = angular.element(template[0].querySelectorAll('.has-submenu'));
      expect(hasSubMenuTags.length).to.eq(7);
    });

    it('getBelowTitle() return the good title ', () => {
      let belowTitle = angular.element(template[0].querySelectorAll('.below-title'));
      expect(belowTitle.html()).to.eq('10 / 10 Modules');
    });


    it('Count the number of element that have .menu-button class', () => {
      let module1 = angular.element(template[0].querySelector('#\\/potentialife-course\\/cycle-1\\/module-1'));
      expect(module1.hasClass('menu-item')).to.eq(true);

      let menuButtonClass = angular.element(module1[0].querySelectorAll('.menu-button'));
      expect(menuButtonClass.length).to.eq(13);
    });

  });

});
