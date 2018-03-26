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


  let findFinalState = ( ioMenu, oStates ) => {

    // Recursive call
    if ( ioMenu.hasOwnProperty('children') ) {

      $log.warn('TONIO findFinalState');
      for ( let child of ioMenu.children ) {
        findFinalState(child, oStates);
      }

      return false;
    }

    // Build state object from a menu Item
    let componentName = 'courseContent';
    let resolveObject = {
      content: () => {
        'ngInject';
        return Data.getDynamicContentPromise('step', false, { slug: ioMenu.fullUrl });
      }
    };

    if ( ioMenu.status === 'locked' ) {
      componentName = 'lockedPage';
      resolveObject = {};
    }

    let state = {
      name: ioMenu.fullUrl,
      url: ioMenu.fullUrl,
      parent: STATES.MAIN,
      component: componentName,
      resolve: resolveObject,
      params: {
        hideStepInMenu: ioMenu.hideStepInMenu
      }
    };

    oStates.push(state);

    return true;
  };


  /**
   * computeMenuForDisplay:
   *   - Add level title at module level (to diplay level title on the back button of steps
   *   - Count visible steps and add their number
   *   - HiddenSteps: hack the status the the first non-hidden steps status reflect the status of the hidden steps (so the good icon is displayed on the menu)
   * @param ioMenu: menu object to modify
   */
  let computeMenuForDisplay = (ioMenu) => {
    for ( let level of ioMenu.children ) {
      if ( level.hasOwnProperty('children') ) {
        level.children.forEach( (module) => {
          module.levelTitle = level.title;

          if ( module.hasOwnProperty('children') ) {

            let previousStepNotHidden = null;
            let stepNumber = 0;

            module.children.forEach( (step) => {

              $log.warn('TONIO step.name=', step.name);

              // For Hidden steps: we need to hack the status of the previous step not hidden
              // to display the good icon in the menu.
              if ( step.hideStepInMenu ) {
                if ( previousStepNotHidden ) {
                  if ( step.status === 'current' || step.status === 'completed' ) {
                    previousStepNotHidden.status = step.status;
                  }
                }
                else {
                  $log.warn(`A hidden step(${step.fullUrl}) should always be preceded by a nonHidden step, problem with the structure of the menu`);
                }
              }
              else {
                // Add a step number that will be displayed in the menu at step level
                previousStepNotHidden = step;
                stepNumber += 1;
              }

              step.stepNumber = stepNumber;

            });
          }

        });
      }
    }
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

        // Modify the menu object to have all the info needed for display
        computeMenuForDisplay(menu.data);

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
    findFinalState,
    computeMenuForDisplay
  };
};

export default MenuFactory;
