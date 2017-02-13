let MenuFactory = function ( $log, $q, _, Data, UserInfo) {
  "ngInject";

  $log = $log.getInstance( "MenuFactory" );

  // This will be the container for the menu object, a ref to this object is used in other module,
  // so it's important to never re-assign the top level object (to don't loose the reference to it)
  let menu = {
    data: {}
  };

  //Each menu item needs to contain the full URL to access it.
  //This is because the full URL is used as the state name
  let convertMenuData = ( ioMenuData, iUrl = '' ) => {
    let url = iUrl + '/' + ioMenuData.slug;

    ioMenuData.fullUrl = url;

    if ( ioMenuData.hasOwnProperty('children') ) {
      for( let child of ioMenuData.children ) {
        convertMenuData(child, url);
      }
    }

    return ioMenuData;
  };

  //********************************************************************************************************
  //                                           Public Interface
  //********************************************************************************************************

  let getMenu = () => menu;

  let getMenuPromise = () => {
    let deferred = $q.defer();

    if ( _.isEmpty(menu.data) ) {
      //Get the menu from back end
      $log.log("getMenuPromise() - Menu is empty, retrieve it from the backend");

      Data.getMenu().get({userid: UserInfo.getUserid()},
        (menuData) => {
          $log.log("getMenuPromise() - Menu Retrieved successfully");

          //For now, we only have one Potentialife course, so we pick the first item in the list
          menu.data = convertMenuData(menuData.data[0]);

          deferred.resolve(menu.data);
          //deferred.reject(menu.data);
        },
        (error) => {

          $log.log("getMenuPromise() - Error while retrieving Menu error=", error);
          deferred.reject(error);
        });

    }
    else {
      deferred.resolve(menu.data);
    }

    return deferred.promise;
  };

  return {
    getMenu,
    getMenuPromise
  };
};

export default MenuFactory;
