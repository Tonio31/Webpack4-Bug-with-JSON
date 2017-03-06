let MenuFactory = function( $log, $q, _, Data) {
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
    if ( iMenu.hasOwnProperty('children') ) {
      for ( let child of iMenu.children ) {
        findFinalState(child, oStates);
      }
    }
    else {
      let state = {
        name: iMenu.fullUrl,
        url: iMenu.fullUrl,
        component: 'courseContent',
        resolve: {
          content: () => {
            'ngInject';
            return Data.getDynamicContentPromise('step', false, { slug: iMenu.fullUrl });
          }
        }
      };

      oStates.push(state);
    }
  };

  // ********************************************************************************************************
  //                                           Public Interface
  // ********************************************************************************************************

  let getMenu = () => {
    return menu;
  };

  let retrieveMenuAndReturnStates = ( iForceRetrieve ) => {
    let deferred = $q.defer();

    if ( _.isEmpty(menu.data) || iForceRetrieve ) {
      // Get the menu from back end
      $log.log(`retrieveMenuAndReturnStates() - _.isEmpty(menu.data)=${_.isEmpty(menu.data)} 
                  iForceRetrieve=${iForceRetrieve}, retrieve menu from the backend`);

      Data.getMenu().get({},
        (menuData) => {
          $log.log('retrieveMenuAndReturnStates() - Menu Retrieved successfully');

          // For now, we only have one Potentialife course, so we pick the first item in the list
          menu.data = menuData.menudata[0];

          let states = [];
          findFinalState(menu.data, states);

          currentProgression.data = menuData.current_progression;

          deferred.resolve(states);
        },
        (error) => {

          $log.log('retrieveMenuAndReturnStates() - Error while retrieving Menu error=', error);
          deferred.reject(error);
        });

    }
    else {
      // No need to return the states if the menu already exist, it means the states have already
      // been defined, but we do need to resolve the promise, so we can redirect the user if
      // necessary (look at interceptor on transitions in app.js)
      deferred.resolve([]);
    }

    return deferred.promise;
  };


  let getCurrentProgression = () => {
    return currentProgression;
  };

  return {
    getMenu,
    retrieveMenuAndReturnStates,
    getCurrentProgression
  };
};

export default MenuFactory;
