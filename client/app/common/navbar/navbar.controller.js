class NavbarController {
  constructor( _, Data, UserInfo, Menu) {
    "ngInject";

    this.testTonio = Menu.menu;

    this.name = 'Potentialife';

    this.menu = {};

    if ( _.isEmpty(this.menu) ) {
      //Menu can be edited via the CMS on the Back End, so we need to build it dynamically
      console.log("NavbarController:: Menu is empty");

      Menu.getMenuPromise().then( (menuData) => {
        this.menu = menuData.children;
        console.log("TONIO NavbarController:: menu=", this.menu);
      });

/*      Data.getMenu().get({userid: UserInfo.getUserid()},
        (menuData) => {
          console.log("Menu Retrieved successfully menuData=", menuData);
          //For now, we only have one Potentialife course, so we pick the first item in the list
          this.menu = menuData.data[0].children;
          console.log("TONIO menu =", this.menu);
        },
        (error) => {

          console.log("Error while retrieving Menu error=", error);
        });*/
    }
    else {
      console.log("NavbarController menu is not empty");
    }
  }
}

export default NavbarController;
