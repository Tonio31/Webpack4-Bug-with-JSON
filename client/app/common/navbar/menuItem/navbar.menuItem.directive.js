
let menuItem = function($window, $filter) {
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
            title: $filter('translate')('LOGOUT').toString(), // TONIO to translate
            name: '',
            status: 'logout'
          };
        },
        post: function($scope, iElem, iAttrs, offCanvasWrap) {

          $scope.hasChildren = (iObject) => {
            return iObject.hasOwnProperty('children');
          };

          let screenWidth = $window.innerWidth;

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
