let MenuFactory = function( $log, $q, Data, STATES) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance( 'MenuFactory' );

  // This will be the container for the menu object, a ref to this object is used in other module,
  // so it's important to never re-assign the top level object (to don't loose the reference to it)
  let menu = {
    data: {}
  };

  // List of all the states computed from the menu that we register dynamically


  let currentProgression = {
    data: {}
  };


  let findFinalState = ( iMenu, oStates ) => {

    // Recursive call
    if ( iMenu.hasOwnProperty('children') ) {

      let previousStepNotHidden = null;

      for ( let child of iMenu.children ) {
        let isFinalState = findFinalState(child, oStates);

        // For Hidden steps: we need to hack the status of the previous step not hidden
        // to display the good icon in the menu.
        if ( isFinalState ) {
          if ( child.hasOwnProperty('hideStepInMenu') && child.hideStepInMenu ) {
            if ( previousStepNotHidden ) {
              if ( child.status === 'current' || child.status === 'completed' ) {
                previousStepNotHidden.status = child.status;
              }
            }
            else {
              $log.warn(`A hidden step(${child.fullUrl}) should always be preceded by a nonHidden step, problem with the structure of the menu`);
            }
          }
          else {
            previousStepNotHidden = child;
          }
        }
      }

      return false;
    }

    // Build state object from a menu Item
    let componentName = 'courseContent';
    let resolveObject = {
      content: () => {
        'ngInject';
        return Data.getDynamicContentPromise('step', false, { slug: iMenu.fullUrl });
      }
    };

    if ( iMenu.status === 'locked' ) {
      componentName = 'lockedPage';
      resolveObject = {};
    }

    let state = {
      name: iMenu.fullUrl,
      url: iMenu.fullUrl,
      parent: STATES.MAIN,
      component: componentName,
      resolve: resolveObject,
      params: {
        hideStepInMenu: iMenu.hideStepInMenu
      }
    };

    oStates.push(state);

    return true;
  };


  // *****************************************************************************************
  //                                           Public Interface
  // *****************************************************************************************

  let isMenuRetrieved = () => {
    if ( Object.keys(menu.data).length === 0 ) {
      return false;
    }

    return true;
  };

  let getMenu = () => {
    return menu;
  };

  let retrieveMenuAndReturnStates = () => {
    let deferred = $q.defer();

    // Get the menu from back end
    $log.log(`retrieveMenuAndReturnStates() - retrieve menu from the backend`);

    Data.getMenu().get({},
      (menuData) => {

        // For now, we only have one Potentialife course, so we pick the first item in the list
        menu.data = menuData.menudata[0];

        $log.log('retrieveMenuAndReturnStates() - Menu Retrieved successfully menu=', menu);

        // Will get a list of states and modify the menu for hidden steps
        let states = [];
        findFinalState(menu.data, states);

        currentProgression.data = menuData.current_progression;

        deferred.resolve(states);
      },
      (error) => {

        $log.log('retrieveMenuAndReturnStates() - Error while retrieving Menu error=', error);
        deferred.reject(error);
      });

    return deferred.promise;
  };


  let getCurrentProgression = () => {
    return currentProgression;
  };

  return {
    getMenu,
    retrieveMenuAndReturnStates,
    isMenuRetrieved,
    getCurrentProgression,
    findFinalState
  };
};

export default MenuFactory;
