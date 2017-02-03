
class HomeController {

  constructor($timeout, $translate, Data, UserData) {
    "ngInject";
    this.name = 'home';
    this.$timeout = $timeout;

    console.log("This is executed");


    this.firstName = UserData.getFirstName();

    this.myName = Data.getUser().name;

    this.resumeProgress = () => {
      console.log("Resume Progress, change state to current step");
    };

    this.nameFromUserFactory = "NOT WORKING";
    this.test = "NOT WORKINGvdsvsvdsvdssdvdvdvs";

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
      let data = UserData.get({}, (test) => {
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
