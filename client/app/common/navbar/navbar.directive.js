let syncMenuAndState = function( $rootScope,
                                 $log ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('Directive - syncMenuAndState');

  return {
    restrict: 'A',
    link: function($scope, element) {

      // **************************************************************************************************
      //                            PRIVATE INTERFACE
      let showMenuPanel = (el) => {
        angular.element(el.getElementsByClassName('left-submenu')[0]).addClass('move-right');
        angular.element(el.getElementsByClassName('right-submenu')[0]).addClass('move-left');

        angular.element(el.parentElement).addClass('show-this-nav');
        angular.element(el.parentElement.parentElement).addClass('fix-nav-under');
      };

      let hideMenuPanel = (el, removeFixNavBar) => {
        angular.element(el.getElementsByClassName('left-submenu')[0]).removeClass('move-right');
        angular.element(el.getElementsByClassName('right-submenu')[0]).removeClass('move-left');

        // fix for nav doubling up behind: adds fix
        angular.element(el.parentElement).removeClass('show-this-nav');

        if ( removeFixNavBar ) {
          angular.element(el.parentElement.parentElement).removeClass('fix-nav-under');
        }
      };

      let showHideMenuPanel = (el, iShowMenuPanel, isToStateCourseStep) => {
        if ( iShowMenuPanel ) {
          showMenuPanel(el);
        }
        else {
          hideMenuPanel(el, !isToStateCourseStep);
        }
      };

      // If the id of the current element is included in the state name, it means we have to
      // display this menuItem, otherwise, hide it
      // Example of toState: /potentialife-course/cycle-1/module-1/step-1, /home, /login
      // Example of id: /potentialife-course/cycle-1, /potentialife-course/cycle-1/module-1, /potentialife-course/cycle-1/module-2
      let isCurrElementIdIncludedInToStateURL = (iToState, iIdElement) => {
        let toStateArray = iToState.split('/');
        let idElementArray = iIdElement.split('/');

        for ( let [ index, value ] of idElementArray.entries() ) {
          if ( value !== toStateArray[index] ) {
            return false;
          }
        }

        return true;
      };

      // **************************************************************************************************
      //                            PUBLIC INTERFACE

      // Whenever we change state, we may have to change the menu
      let stateChangeSuccessEvent = $rootScope.$on('stateChangeSuccess', (event, toState) => {

        let showMenuPanelBool = isCurrElementIdIncludedInToStateURL(toState, element[0].id);
        // let showMenuPanelBool = toState.includes(element[0].id);

        // Hack: if we want to display a step, it means we don't want to remove the class fix-nav-under
        // This is because fix-nav-under class hide the parent.parent element while show-nav-under forces
        // to display it
        // If we display anything else than a step, the menu will have to be open at the top level, so we
        // want to remove all the classes previously added for navigation including all fix-nav-under
        let isToStateCourseStep = toState.includes('/potentialife-course');

        showHideMenuPanel(element[0], showMenuPanelBool, isToStateCourseStep);
      });

      $rootScope.$on('$destroy', stateChangeSuccessEvent);


      // When we click on an item menu, we want to display the sub-menu
      element.on('click', (event) => {
        event.stopPropagation();
        showMenuPanel(element[0]);
        $log.log('Menu Item Clicked!! element=', element[0].id, '   event=', event);
      });

      // If we click on Back button, we need to hide the menu
      angular.element(element[0].getElementsByClassName('btn-back-home')[0]).on('click', (event) => {
        event.stopPropagation();
        hideMenuPanel(element[0], true);
        $log.log('BACK Clicked!! element=', element[0].id, '   event=', event);
      });
    }
  };
};

let plDisableLink = function() {
  'ngInject';
  return {
    restrict: 'A',
    scope: {
      disable: '=plDisableLink'
    },
    link: function( $scope, element ) {
      element.bind('click', (event) => {
        if ( $scope.disable ) {
          event.preventDefault();
        }
      });
    }
  };
};

export {
  syncMenuAndState,
  plDisableLink
};
