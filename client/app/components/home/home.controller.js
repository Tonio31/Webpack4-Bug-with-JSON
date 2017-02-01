
class HomeController {

  constructor($timeout, $translate, User) {
    "ngInject";
    this.name = 'home';
    this.$timeout = $timeout;
    this.User = User;

    this.myName = User.getUser().name;
    console.log("myName=" + this.myName);

    this.getName = function() {
      return User.getUser().name;
    };


    $translate('TITLE').then( (headline) => {
      this.headline = headline;
    })
      .catch( (translationId) => {
      this.headline = translationId;
    });


  }

}


export default HomeController;
