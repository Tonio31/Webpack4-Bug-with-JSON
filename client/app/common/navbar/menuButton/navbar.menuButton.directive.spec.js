// import NavbarModule from '../navbar';
//
// describe('Navbar MenuButton Directive', () => {
//   let $rootScope, $compile, ZendeskWidget;
//
//   let menuJson = require('app/mockBackEndResponse/51/menu.json');
//
//   let mockTranslateFilter = (value) => {
//     return value;
//   };
//
//   beforeEach(window.module(NavbarModule, ($provide) => {
//     $provide.value('translateFilter', mockTranslateFilter );
//     $provide.value('ZendeskWidget', ZendeskWidget );
//   }));
//
//   beforeEach(inject(($injector) => {
//     $rootScope = $injector.get('$rootScope');
//     $compile = $injector.get('$compile');
//   }));
//
//   describe('<menu-button data="child"></menu-button>', () => {
//     // view layer specs.
//     let scope, template;
//
//     beforeEach(() => {
//       scope = $rootScope.$new();
//       scope.menuData = menuJson.menudata[0].children[0].children[1].children[0];
//       template = $compile('<menu-button data="menuData"></menu-button>')(scope);
//       scope.$apply();
//     });
//
//     it('has a 3 <p> tags with correct values from the input', () => {
//       let pTags = angular.element(template[0].querySelectorAll('p'));
//       expect(pTags.length).to.eq(3);
//       expect(pTags[0].textContent).to.contain(scope.menuData.topTitle);
//       expect(pTags[1].textContent).to.contain(scope.menuData.name);
//       expect(pTags[2].textContent).to.contain(scope.menuData.description);
//     });
//
//
//     it('CSS class is added depending on the menu item status (current, locked, completed)', () => {
//       expect(template.hasClass(scope.menuData.status)).to.eq(true);
//     });
//
//     it('CSS class (current, locked, completed) is modified if the status of the menu change', () => {
//       let oldStatus = scope.menuData.status; // completed
//
//       scope.menuData.status = 'locked';
//       scope.$apply();
//       expect(template.hasClass(oldStatus)).to.eq(false);
//       expect(template.hasClass(scope.menuData.status)).to.eq(true);
//     });
//   });
//
//
// });
