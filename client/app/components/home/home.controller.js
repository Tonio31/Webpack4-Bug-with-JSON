
class HomeController {

  constructor($log, $translate, Data, UserInfo, Menu) {
    "ngInject";
    $log = $log.getInstance( "Home" );



    this.name = 'home';

    this.firstName = UserInfo.getFirstName();

    this.myName = Data.getUser().name;

    this.resumeProgress = () => {
      $log.log("Resume Progress, change state to current step");
    };

    this.nameFromUserFactory = "NOT WORKING";
    this.test = "NOT WORKINGvdsvsvdsvdssdvdvdvs";


    this.nameFromMenuServuce = Menu.menu;


    this.getName = function() {
      return Data.getUser().name;
    };

    this.getAllUserData = () => {
      $log.log("this.getAllUserData", "  several arguments");
      let userInfo = {
        userid: 12
      };

      this.test = Data.getUserData().get(userInfo);


      this.nameFromUserFactory = Data.getUserData().get(userInfo, (test) => {
          $log.log("sucess test=", test);
      },
        (error) => {
          $log.log("error=", error);
        });
      return;
    };


    this.getAllUserData2 = () => {
      $log.log("this.getAllUserData2");
      let data = UserInfo.get({}, (test) => {
          $log.log("sucess test=", test);
        },
        (error) => {
          $log.log("error=", error);
        });
      return data;
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
