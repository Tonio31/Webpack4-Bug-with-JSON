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


let menuItem = function ($log) {
  "ngInject";
  return {
    require: '^offCanvasWrap',
    restrict: 'E',
    replace: false,
    scope: {
      item: '='
    },
    template: `
        <div ng-repeat="child in item.children track by child.id">
            <li ng-if="hasChildren(child)" class="has-submenu" >
              <a href="">{{child.title}}</a>
              <ul class="left-submenu">
                <li class="back"><a href="">Back {{child.title}}</a></li>
                <li><label>{{child.title}}</label></li>
                <menu-item item="child"></menu-item>
              </ul>
            </li>
            <li ng-if="!hasChildren(child)" ng-click="hideCanvas(child)"><a ui-sref="{{child.fullUrl}}">{{child.title}}</a></li>
        </div>
    `,
    compile: function (tElem, tAttrs) {
      return {
        post: function ($scope, iElem, iAttrs, offCanvasWrap) {

          $scope.hasChildren = function(iObject) {
            return iObject.hasOwnProperty('children');
          };

          $scope.hideCanvas = function(iObject) {
            if (!$scope.hasChildren(iObject)) {
              offCanvasWrap.hide();
            }
          };
        }
      }
    }
  }
};



export { offCanvasListBugfixDef, moveMenu, menuItem };
