

class HomeController {



  constructor($timeout, User) {
    "ngInject";
    this.name = 'home';
    this.$timeout = $timeout;
    this.User = User;

    this.myName = User.getUser().name;
    console.log("myName=" + this.myName);

  }

}


export default HomeController;
