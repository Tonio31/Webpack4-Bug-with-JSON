let MenuService = function ( $q, _, Data, UserInfo) {
  "ngInject";

  //This will be the container for the menu object
  let menu = {};

  console.log("Inside Menu Service, I should see this only once");

  if ( _.isEmpty(menu) ) {
    console.log("MenuService:: Menu is empty");
  }

  this.menu = {
    somedata: "test Tonio"
  };


  let buildFullURL = ( iSubMenu, iCurrentUrl ) => {

  };

  let convertMenuData = ( ioMenuData, iUrl = '' ) => {
    let url = iUrl + '/' + ioMenuData.slug;

    ioMenuData.fullUrl = url;

    if ( ioMenuData.hasOwnProperty('children') ) {
      for( let child of ioMenuData.children ) {
        convertMenuData(child, url);
      }
    }
  };

  //********************************************************************************************************
  //                                           Public Interface
  //********************************************************************************************************

  this.getMenu = () => menu;

  this.getMenuPromise = () => {
    let deferred = $q.defer();

    if ( _.isEmpty(menu) ) {
      //Get the menu from back end
      console.log("MenuService:: Menu is empty");

      Data.getMenu().get({userid: UserInfo.getUserid()},
        (menuData) => {
          console.log("MenuService:: Menu Retrieved successfully menuData=", menuData);

          convertMenuData(menuData.data[0]);

          //For now, we only have one Potentialife course, so we pick the first item in the list
          menu = menuData.data[0];
          console.log("MenuService:: menu =", menu);
          deferred.resolve(menu);
        },
        (error) => {

          console.log("Error while retrieving Menu error=", error);
          deferred.resolve(error);
        });
    }
    else {
      deferred.resolve(menu);
    }

    return deferred.promise;
  };

};

export default MenuService;
