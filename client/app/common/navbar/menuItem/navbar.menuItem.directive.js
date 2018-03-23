
let menuItem = function($window, $filter, $state) {
  'ngInject';
  return {
    require: '^offCanvasWrap',
    restrict: 'E',
    replace: false,
    scope: {
      item: '='
    },
    template: require('./navbar.menuItem.template.html'),
    compile: function() {
      return {
        pre: function($scope) {
          $scope.logoutButtonData = {
            title: ' ',
            name: 'Log out', // TONIO to translate
            description: ' ',
            status: 'icon-logout'
          };
        },
        post: function($scope, iElem, iAttrs, offCanvasWrap) {

          let screenWidth = $window.innerWidth;



          $scope.testTonioFuck = () => {
            return '';
          };

          // $scope.getbackButtonData = (iChild) => {
          //   return {
          //     topTitle: iChild.topTitle,
          //     name: iChild.name,
          //     // description: $scope.getBelowTitle(iChild),
          //     description: 'TEST TONIO',
          //     status: 'back'
          //   };
          // };

          // $scope.getbackButtonData = (iChild) => {
          //   return {
          //     topTitle: 'TONIO',
          //     name: 'TONIO TEST',
          //     // description: $scope.getBelowTitle(iChild),
          //     description: 'TEST TONIO',
          //     status: 'back'
          //   };
          // };

          $scope.testTonio = {
            title: 'tonio',
            name: 'tonio',
            // description: $scope.getBelowTitle(iChild),
            description: 'TEST TONIO',
            status: 'back'
          };

          $scope.hasChildren = (iObject) => {
            return iObject.hasOwnProperty('children');
          };

          $scope.test = 'active';

          $scope.hideCanvas = () => {
            // prevent large screens from closing menu automatically after clicking a menuitem
            if (screenWidth <= 1024) {
              offCanvasWrap.hide();
            }
          };

        }
      };
    }
  };
};

export default menuItem;
