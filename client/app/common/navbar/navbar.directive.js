// HACK
// There is a bug in the offCanvas with Angular, the submenu are not working properly
// as described here: https://github.com/pineconellc/angular-foundation/pull/137
// The workaround to fix this is to redefine the directive and the css associated

let addOrRemoveClass = (element, iAddClass) => {
  if ( iAddClass ) {
    // we have to open this menu Panel, add all the necessary class
    angular.element(element.getElementsByClassName('left-submenu')[0]).addClass('move-right');
    angular.element(element.getElementsByClassName('right-submenu')[0]).addClass('move-left');

    // fix for nav doubling up behind: adds fix
    angular.element(element.parentElement).addClass('show-this-nav');
    angular.element(element.parentElement.parentElement).addClass('fix-nav-under');
  }
  else {
    angular.element(element.getElementsByClassName('left-submenu')[0]).removeClass('move-right');
    angular.element(element.getElementsByClassName('right-submenu')[0]).removeClass('move-left');

    // fix for nav doubling up behind: adds fix
    angular.element(element.parentElement).removeClass('show-this-nav');
    angular.element(element.parentElement.parentElement).removeClass('fix-nav-under');
  }
};


let syncMenuAndState = function($rootScope, $log) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('Directive - syncMenuAndState');

  return {
    restrict: 'A',
    link: function($scope, element) {

      // Whenever we change state, we may have to change the menu
      let stateChangeSuccessEvent = $rootScope.$on('stateChangeSuccess', (event, toState) => {
        let id = element[0].id;
        addOrRemoveClass(element[0], toState.includes(id));
        $log.debug(event, toState);
      });

      $rootScope.$on('$destroy', stateChangeSuccessEvent);

      // When we click on an item menu, we want to display the sub-menu
      element.on('click', (event) => {
        event.stopPropagation();
        addOrRemoveClass(element[0], true);
        $log.log('Menu Item Clicked!! element=', element[0].id, '   event=', event);
      });

      // If we click on Back button, we need to hide the menu
      angular.element(element[0].getElementsByClassName('back')[0]).on('click', (event) => {
        event.stopPropagation();
        addOrRemoveClass(element[0], false);
        $log.log('BACK Clicked!! element=', element[0].id, '   event=', event);
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
      $scope.$watch('data.status', (newStatus, oldStatus) => {
        if ( newStatus !== oldStatus ) {
          angular.element(element).removeClass(oldStatus);
          angular.element(element).addClass(newStatus);

          $log.log('The value has changed, oldStatus=', oldStatus, '   newStatus=', newStatus);
        }
      }, false);
    }
  };
};

export {
  syncMenuAndState,
  menuItem,
  menuButton
};
