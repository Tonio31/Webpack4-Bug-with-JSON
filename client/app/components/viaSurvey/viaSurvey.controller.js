class ViaSurveyController {
  constructor($log, Data) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ViaSurveyController' );

    $log.log('constructor - START');

    this.name = 'viaSurvey';


    let appKey = 'testkey';
    let apiBaseUrl = 'https://www.viacharacter.org/survey/api1/';
    let surveyID = 86; // The list of available surveys can be retrieved by the GetSurveys API method. The VIA-120 is survey ID 86.
   // let loginKey; // The login key is returned from the LoginUser service call. It is used for starting surveys.s
   // let sessionKey; // The sesion key is returned from the StartSurvey service call. It is used for getting questions and submitting answers.

    // 'appKey=testkey&sendWelcomeEmailToUser=false&email=test1491489134393%40test.com&firstName=test&lastName=test&gender=M&password=testtesttest'
    let registerFormData = {
      appKey: 'testkey',
      sendWelcomeEmailToUser: false,
      email: 'test1491489134393@test.com',
      firstName: 'test',
      lastName: 'test',
      gender: 'M',
      password: 'testtesttest'
    };

    this.startSurvey = () => {
      $log.log('Start survey');

      let registerUserPost = Data.viaSurvey('RegisterUser');

      Object.assign(registerUserPost, registerFormData);

      $log.log('registerUserPost=', registerUserPost);

      registerUserPost.$save( (dataBackFromViaSurveyRegisterUser) => {
        $log.log('Success registering dataBackFromViaSurveyRegisterUser=', dataBackFromViaSurveyRegisterUser);
      }, (error) => {
        // Display error Banner for the user

        $log.log('Error saving the current step. error=', error);
      });


    };

  }
}

export default ViaSurveyController;
