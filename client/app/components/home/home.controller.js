
class HomeController {

  constructor($timeout, $translate, Data, UserInfo, Menu) {
    "ngInject";
    this.name = 'home';
    this.$timeout = $timeout;

    console.log("TONIO This is executed");

    this.firstName = UserInfo.getFirstName();

    this.myName = Data.getUser().name;

    this.resumeProgress = () => {
      console.log("Resume Progress, change state to current step");
    };

    this.nameFromUserFactory = "NOT WORKING";
    this.test = "NOT WORKINGvdsvsvdsvdssdvdvdvs";


    this.nameFromMenuServuce = Menu.menu;
    this.nameFromMenuServiceFunction = Menu.getMenu();


    this.getName = function() {
      return Data.getUser().name;
    };

    this.getAllUserData = () => {
      console.log("this.getAllUserData");
      let userInfo = {
        userid: 12
      };

      this.test = Data.getUserData().get(userInfo);


      this.nameFromUserFactory = Data.getUserData().get(userInfo, (test) => {
        console.log("sucess test=", test);
      },
        (error) => {
        console.log("error=", error);
        });
      return;
    };


    this.getAllUserData2 = () => {
      console.log("this.getAllUserData2");
      let data = UserInfo.get({}, (test) => {
          console.log("sucess test=", test);
        },
        (error) => {
          console.log("error=", error);
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
