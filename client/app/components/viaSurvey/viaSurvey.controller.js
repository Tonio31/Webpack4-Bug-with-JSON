class ViaSurveyController {
  constructor($log, Data) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ViaSurveyController' );

    $log.log('constructor - START');

    this.name = 'viaSurvey';

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
