let MenuFactory = function( $log, $q, _, Data) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance( 'MenuFactory' );

  // This will be the container for the menu object, a ref to this object is used in other module,
  // so it's important to never re-assign the top level object (to don't loose the reference to it)
  let menu = {
    data: {}
  };

  let currentProgression = {
    data: {}
  };


  let buildFullUrls = ( ioMenuData, iUrl = '') => {
    let url = `${iUrl}/${ioMenuData.slug}`;

    ioMenuData.fullUrl = url;

    // Recursive function to build the URL and calculate progression for all module
    if ( ioMenuData.hasOwnProperty('children') ) {

      for ( let child of ioMenuData.children ) {
        buildFullUrls(child, url);
      }
    }

    return ioMenuData;
  };


  // Each menu item needs to contain the full URL to access it.
  // This is because the full URL is used as the state name
  let convertMenuData = ( ioMenuData ) => {

    buildFullUrls(ioMenuData);

    return ioMenuData;
  };


  // ********************************************************************************************************
  //                                           Public Interface
  // ********************************************************************************************************

  let getMenu = () => {
    return menu;
  };

  let getMenuPromise = ( iForceRetrieve ) => {
    let deferred = $q.defer();

    if ( _.isEmpty(menu.data) || iForceRetrieve ) {
      // Get the menu from back end
      $log.log(`getMenuPromise() - Menu is empty or iForceRetrieve=true 
                (iForceRetrieve=${iForceRetrieve}, retrieve it from the backend`);

      // iForceRetrieve not needed here, hack to test TONIO
      Data.getMenu().get({},
        (menuData) => {
          $log.log('getMenuPromise() - Menu Retrieved successfully');

          // For now, we only have one Potentialife course, so we pick the first item in the list
          menu.data = convertMenuData(menuData.menudata[0]);

          currentProgression.data = menuData.current_progression;

          deferred.resolve(menu.data);
        },
        (error) => {

          $log.log('getMenuPromise() - Error while retrieving Menu error=', error);
          deferred.reject(error);
        });

    }
    else {
      deferred.resolve(menu.data);
    }

    return deferred.promise;
  };

  let getCurrentProgression = () => {
    return currentProgression;
  };

  return {
    getMenu,
    getMenuPromise,
    getCurrentProgression
  };
};

export default MenuFactory;
