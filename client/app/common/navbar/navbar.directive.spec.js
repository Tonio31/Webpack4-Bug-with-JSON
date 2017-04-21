import NavbarModule from './navbar';

describe('Navbar Directive', () => {
  let $rootScope, $compile;

  let menuJson = require('app/mockBackEndResponse/menu-1.json');

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(NavbarModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
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
      expect(hasSubMenuTags.length).to.eq(6);
    });

    it('getBellowTitle() return the good title ', () => {
      let belowTitle = angular.element(template[0].querySelectorAll('.below-title'));
      expect(belowTitle.html()).to.eq('10 / 10 Modules');
    });


    it('Count the number of element that have .menu-button class', () => {
      let module1 = angular.element(template[0].querySelector('#\\/potentialife-course\\/cycle-1\\/module-1'));
      expect(module1.hasClass('menu-item')).to.eq(true);

      let menuButtonClass = angular.element(module1[0].querySelectorAll('.menu-button'));
      expect(menuButtonClass.length).to.eq(12);
    });

  });


  describe('<menu-button data="child"></menu-button>', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.menuData = menuJson.menudata[0].children[0].children[1].children[0];
      template = $compile('<menu-button data="menuData"></menu-button>')(scope);
      scope.$apply();
    });

    it('has a 3 <p> tags with correct values from the input', () => {
      let pTags = angular.element(template[0].querySelectorAll('p'));
      expect(pTags.length).to.eq(3);
      expect(pTags[0].textContent).to.contain(scope.menuData.title);
      expect(pTags[1].textContent).to.contain(scope.menuData.name);
      expect(pTags[2].textContent).to.contain(scope.menuData.description);
    });


    it('CSS class is added depending on the menu item status (current, locked, completed)', () => {
      expect(template.hasClass(scope.menuData.status)).to.eq(true);
    });

    it('CSS class (current, locked, completed) is modified if the status of the menu change', () => {
      let oldStatus = scope.menuData.status; // completed

      scope.menuData.status = 'locked';
      scope.$apply();
      expect(template.hasClass(oldStatus)).to.eq(false);
      expect(template.hasClass(scope.menuData.status)).to.eq(true);
    });
  });


  describe('sync-state - SyncMenuAndState', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {

      let templateToTest = `
        <div id="container">
          <div id="fixNav">
            <div id="showNav1">
              <li sync-state id="/potentialife-course/cycle-1/module-1" class="has-submenu menu-item">
                <a href=""><p>Link</p></a>
                <ul class="left-submenu">
                  <li class="back btn-back-home"></li>
                </ul>
              </li>
            </div>
            <div id="showNav2">
              <li sync-state id="/potentialife-course/cycle-2/module-1" class="has-submenu menu-item">
                <a href=""><p>Link</p></a>
                <ul class="left-submenu">
                  <li class="back btn-back-home"></li>
                </ul>
              </li>
            </div>
          </div>
        </div>
      `;

      scope = $rootScope.$new();
      template = $compile(templateToTest)(scope);
      scope.$apply();
    });


    it('insert good css classes when stateChangeSuccess Event is triggered', (done) => {

      // This unit test doesn't work with PhantomJS
      // see for details: http://stackoverflow.com/questions/42977485/undefined-is-not-a-constructor-on-event-statechangesuccess-with-phantomjs-moch
      // I leave it here because it does work with Chrome, so it's a good idea to keep it to work in local
      // the way to detect if PhantomJS is running is dirty (rely on gulp setKarmaGlobals), if you read this code and knows a better way, be my guest
      let karmaGlobals = require('karmaGlobals.json');
      if ( karmaGlobals.browser !== 'PhantomJS' ) {

        let toState = '/potentialife-course/cycle-1/module-1/step-11';
        $rootScope.$emit('stateChangeSuccess', toState);

        let showNav1 = angular.element(template[0].querySelector('#showNav1'));
        expect(showNav1.hasClass('show-this-nav')).to.eq(true);

        let showNav2 = angular.element(template[0].querySelector('#showNav2'));
        expect(showNav2.hasClass('show-this-nav')).to.eq(false);

        let fixNav = angular.element(template[0].querySelector('#fixNav'));
        expect(fixNav.hasClass('fix-nav-under')).to.eq(true);

        let leftSubMenu = angular.element(template[0].querySelector('.left-submenu'));
        expect(leftSubMenu.hasClass('move-right')).to.eq(true);

        // Remove all the classes if we go to hte home page
        toState = '/home';
        $rootScope.$emit('stateChangeSuccess', toState);
        expect(showNav1.hasClass('show-this-nav')).to.eq(false);
        expect(showNav2.hasClass('show-this-nav')).to.eq(false);
        expect(fixNav.hasClass('fix-nav-under')).to.eq(false);
        expect(leftSubMenu.hasClass('move-right')).to.eq(false);
      }

      done();
    });

    it('insert and remove css classes when a menuButton is clicked and Back button is clicked after', (done) => {

      // Click on the menu Item button
      let syncStateTag = angular.element(template[0].querySelector('#\\/potentialife-course\\/cycle-1\\/module-1'));
      syncStateTag.triggerHandler('click');
      scope.$apply();

      let showNav1 = angular.element(template[0].querySelector('#showNav1'));
      expect(showNav1.hasClass('show-this-nav')).to.eq(true);

      let fixNav = angular.element(template[0].querySelector('#fixNav'));
      expect(fixNav.hasClass('fix-nav-under')).to.eq(true);

      let leftSubMenu = angular.element(template[0].querySelector('.left-submenu'));
      expect(leftSubMenu.hasClass('move-right')).to.eq(true);


      // Click on the back button
      let backButton = angular.element(template[0].querySelector('.back'));
      backButton.triggerHandler('click');
      scope.$apply();

      expect(showNav1.hasClass('show-this-nav')).to.eq(false);
      expect(fixNav.hasClass('fix-nav-under')).to.eq(false);
      expect(leftSubMenu.hasClass('move-right')).to.eq(false);

      done();
    });

  });

});
