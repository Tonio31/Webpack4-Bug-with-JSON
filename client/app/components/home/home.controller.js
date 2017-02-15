
class HomeController {

  constructor($log, $resource, $http, $translate, Data, UserInfo, Menu) {
    "ngInject";
    $log = $log.getInstance( "Home" );



    this.name = 'home';

    this.firstName = UserInfo.getFirstName();

    this.myName = Data.getUser().name;

    this.resumeProgress = () => {
      $log.log("Resume Progress, change state to current step");
    };

    this.updateStep = () => {
      //Menu.getMenuPromise(true);

      //Menu.setStepCompleted('/potentialife-course/cycle-1/module-1/step-7');


      var test = Data.updateStep();

      //var dataToSend = new test();
      test.something = "something to send";

      $log.log('About to send the POST request');
      test.$save(function(user, putResponseHeaders) {
        //user => saved user object
        //putResponseHeaders => $http header getter

        var wtf = putResponseHeaders()

        $log.log("wtf=", wtf);

        $log.log(user);
        $log.log(putResponseHeaders);
      });

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
