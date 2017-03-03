// HACK
// There is a bug in the offCanvas with Angular, the submenu are not working properly
// as described here: https://github.com/pineconellc/angular-foundation/pull/137
// The workaround to fix this is to redefine the directive and the css associated


let offCanvasListBugfixDef = function() {
  'ngInject';
  return {
    require: '^offCanvasWrap',
    restrict: 'C',
    link: function($scope, element, attrs, offCanvasWrap) {
      element.find('li').on('click', function(e) {
        e.stopPropagation();
        if (angular.element(this).hasClass('has-submenu')) {
          angular.element(this.getElementsByClassName('left-submenu')[0]).addClass('move-right');
          angular.element(this.getElementsByClassName('right-submenu')[0]).addClass('move-left');
        }
        else if (angular.element(this).hasClass('back')) {
          angular.element(this.parentElement).removeClass('move-right');
          angular.element(this.parentElement).removeClass('move-left');
        }
        else {
          offCanvasWrap.hide();
        }
      });
    }
  };
};

let moveMenu = function($log) {
  'ngInject';
  return {
    require: '^offCanvasWrap',
    restrict: 'C',
    link: function($scope, element, attrs, offCanvasWrap) {
      element.on('click', function(e) {
        e.stopPropagation();
        if (angular.element(this).hasClass('has-submenu')) {
          angular.element(this.getElementsByClassName('left-submenu')[0]).addClass('move-right');
          angular.element(this.getElementsByClassName('right-submenu')[0]).addClass('move-left');

          //fix for nav doubling up
          angular.element(this.parentElement).addClass('show-this-nav');
          angular.element(this.parentElement.parentElement).addClass('fix-nav-under');
        }
        else if (angular.element(this).hasClass('back')) {
          angular.element(this.parentElement).removeClass('move-right');
          angular.element(this.parentElement).removeClass('move-left');

          //fix for nav doubling up
          angular.element(this.parentElement.parentElement.parentElement).removeClass('show-this-nav');
          angular.element(this.parentElement.parentElement.parentElement.parentElement).removeClass('fix-nav-under');
        }
        else {
          offCanvasWrap.hide();
        }
      });
    }
  };
};


let menuItem = function() {
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
        post: function($scope, iElem, iAttrs, offCanvasWrap) {

          $scope.hasChildren = (iObject) => {
            return iObject.hasOwnProperty('children');
          };

          $scope.hideCanvas = () => {
            offCanvasWrap.hide();
          };

        }
      };
    }
  };
};


let menuButton = function($log) {
  'ngInject';
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    template: `
      <div class='menu-button row small-collapse'>
        <div class='small-2 columns'>
          <span class='pl-menu-button'></span>

        </div>
        <div class='small-10 columns'>
            <p class='top-title'>{{data.title}}</p>
            <p class='main-title'>{{data.name}}</p>
            <p class='below-title'>{{data.description}}</p>
          </div>
          <i class='arrow'></i>
      </div>
    `,
    link: function($scope, element) {

      angular.element(element).addClass($scope.data.status);
      // This will be used to change the icon on the left side of the menu, this way we just need to
      // update our menu inside menuFactory and the changes are propagated automatically
      $scope.$watch('data.status', (newValue, oldValue) => {
        if ( newValue !== oldValue ) {
          angular.element(element).removeClass(oldValue);
          angular.element(element).addClass(newValue);

          $log.log('The value has changed, oldValue=', oldValue, '   newValue=', newValue);
        }
      }, false);


    }
  };
};

export { offCanvasListBugfixDef, moveMenu, menuItem, menuButton };
