let MenuFactory = function( $log, $q, _, Data, UserInfo) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance( 'MenuFactory' );

  // This will be the container for the menu object, a ref to this object is used in other module,
  // so it's important to never re-assign the top level object (to don't loose the reference to it)
  let menu = {
    data: {}
  };

  // Each menu item needs to contain the full URL to access it.
  // This is because the full URL is used as the state name
  let convertMenuData = ( ioMenuData, iUrl = '' ) => {
    let url = `${iUrl}/${ioMenuData.slug}`;

    ioMenuData.fullUrl = url;

    if ( ioMenuData.hasOwnProperty('children') ) {
      for ( let child of ioMenuData.children ) {
        convertMenuData(child, url);
      }
    }

    return ioMenuData;
  };

  let findAndUpdateStatus = ( ioMenuData, iFullUrl, iNewStatus ) => {
    if ( ioMenuData.fullUrl === iFullUrl ) {
      ioMenuData.status = iNewStatus;
    }
    else if ( ioMenuData.hasOwnProperty('children') ) {
      for ( let child of ioMenuData.children ) {
        findAndUpdateStatus(child, iFullUrl, iNewStatus);
      }
    }
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
      $log.log('getMenuPromise() - Menu is empty, retrieve it from the backend');

      // iForceRetrieve not needed here, hack to test TONIO
      Data.getMenu(iForceRetrieve).get({ userid: UserInfo.getUserid() },
        (menuData) => {
          $log.log('getMenuPromise() - Menu Retrieved successfully');

          // For now, we only have one Potentialife course, so we pick the first item in the list
          menu.data = convertMenuData(menuData.data[0]);

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


  let setStepCompleted = (iFullUrl) => {
    if ( angular.isDefined(iFullUrl) && !_.isEmpty(iFullUrl) ) {
      findAndUpdateStatus(menu.data, iFullUrl, 'completed');
    }
    else {
      throw new Error('Trying to set a completed Step without specifying the fullUrl');
    }
  };


  return {
    getMenu,
    getMenuPromise,
    setStepCompleted
  };
};

export default MenuFactory;
