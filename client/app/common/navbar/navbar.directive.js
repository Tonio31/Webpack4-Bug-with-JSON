//HACK
//There is a bug in the offCanvas with Angular, the submenu are not working properly
//as described here: https://github.com/pineconellc/angular-foundation/pull/137
//The workaround to fix this is to redefine the directive and the css associated

let offCanvasListBugfixDef = function () {
  "ngInject";
  return {
    require: '^offCanvasWrap',
    restrict: 'C',
    link: function ($scope, element, attrs, offCanvasWrap) {
      element.find('li').on('click', function (e) {
        e.stopPropagation();
        if (angular.element(this).hasClass('has-submenu')) {
          angular.element(this.getElementsByClassName('left-submenu')[0]).addClass('move-right');
          angular.element(this.getElementsByClassName('right-submenu')[0]).addClass('move-left');
        } else if (angular.element(this).hasClass('back')) {
          angular.element(this.parentElement).removeClass('move-right');
          angular.element(this.parentElement).removeClass('move-left');
        } else {
          offCanvasWrap.hide();
        }
      });
    }
  };
};

let moveMenu = function () {
  "ngInject";
  return {
    require: '^offCanvasWrap',
    restrict: 'C',
    link: function ($scope, element, attrs, offCanvasWrap) {
      element.on('click', function (e) {
        e.stopPropagation();
        if (angular.element(this).hasClass('has-submenu')) {
          angular.element(this.getElementsByClassName('left-submenu')[0]).addClass('move-right');
          angular.element(this.getElementsByClassName('right-submenu')[0]).addClass('move-left');
        } else if (angular.element(this).hasClass('back')) {
          angular.element(this.parentElement).removeClass('move-right');
          angular.element(this.parentElement).removeClass('move-left');
        } else {
          offCanvasWrap.hide();
        }
      });
    }
  };
};


let menuItem = function () {
  "ngInject";
  return {
    require: '^offCanvasWrap',
    restrict: 'E',
    replace: false,
    scope: {
      item: '='
    },
    template: require('./navbar.menuItem.template.html'),
    compile: function () {
      return {
        post: function ($scope, iElem, iAttrs, offCanvasWrap) {

          $scope.hasChildren = function(iObject) {
            return iObject.hasOwnProperty('children');
          };

          $scope.hideCanvas = function() {
              offCanvasWrap.hide();
          };

        }
      }
    }
  }
};


let menuButton = function () {
  "ngInject";
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    template: `
      <div class="menu-button row small-collapse">
        <div class="small-2 columns">
          <span class="pl-menu-button"></span>
        
        </div>
        <div class="small-10 columns">
            <p class="top-title">{{data.title}}</p>
            <p class="main-title">{{data.name}}</p>
            <p class="below-title">{{data.description}}</p>
          </div>
      </div>
    `,
    link: function ($scope, element) {

      angular.element(element).addClass($scope.data.status);
    }
  }
};





export { offCanvasListBugfixDef, moveMenu, menuItem, menuButton };
