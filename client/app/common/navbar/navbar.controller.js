class NavbarController {
  constructor( _ ) {
    "ngInject";

    this.name = 'Potentialife';

    this.menu = {};

    if ( _.isEmpty(this.menu) ) {
      console.log("Menu is empty");
    }



  }
}

export default NavbarController;
