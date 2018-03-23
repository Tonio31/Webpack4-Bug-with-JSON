import NavbarModule from './navbar';

describe('Navbar Directive', () => {
  let $rootScope, $compile, ZendeskWidget;

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
              <li sync-state id="/potentialife-course/cycle-1/module-10" class="has-submenu menu-item">
                <a href=""><p>Link</p></a>
                <ul class="left-submenu">
                  <li class="back btn-back-home"></li>
                </ul>
              </li>
            </div>
            <div id="showNav3">
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

        let toState = '/potentialife-course/cycle-1/module-10/step-11';
        $rootScope.$emit('stateChangeSuccess', toState);

        let showNav1 = angular.element(template[0].querySelector('#showNav1'));
        expect(showNav1.hasClass('show-this-nav')).to.eq(false);

        let showNav2 = angular.element(template[0].querySelector('#showNav2'));
        expect(showNav2.hasClass('show-this-nav')).to.eq(true);

        let leftSubMenuNav2 = angular.element(template[0].querySelector('#showNav2 .left-submenu'));
        expect(leftSubMenuNav2.hasClass('move-right')).to.eq(true);

        let showNav3 = angular.element(template[0].querySelector('#showNav3'));
        expect(showNav3.hasClass('show-this-nav')).to.eq(false);

        let fixNav = angular.element(template[0].querySelector('#fixNav'));
        expect(fixNav.hasClass('fix-nav-under')).to.eq(true);


        // Remove all the classes if we go to hte home page
        toState = '/home';
        $rootScope.$emit('stateChangeSuccess', toState);
        expect(showNav1.hasClass('show-this-nav')).to.eq(false);
        expect(showNav2.hasClass('show-this-nav')).to.eq(false);
        expect(fixNav.hasClass('fix-nav-under')).to.eq(false);
        expect(leftSubMenuNav2.hasClass('move-right')).to.eq(false);
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
