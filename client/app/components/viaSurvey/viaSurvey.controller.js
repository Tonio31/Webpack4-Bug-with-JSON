class ViaSurveyController {
  constructor($log, User, Data, ContentFactory, SpinnerFactory, SPINNERS) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ViaSurveyController' );

    $log.log('constructor - START');

    this.name = 'viaSurvey';

    this.surveyStarted = false;
    this.radioQuestions = [];

    this.answers = {};
    this.addAnswer = (iQuestionID, iAnswerID) => {
      this.answers[iQuestionID] = iAnswerID;
      $log.log('this.answers=', this.answers);
    };


    this.createViaSurveyPassword = (iFirstName, iLastName) => {
      return `${iFirstName}!@#$%${iLastName}`;
    };

    this.viaSurveyData = {
      appKey: 'F1206FA8-6CEA-4E67-97CE-611B925D50C4',
      surveyID: 86,
      questionCount: 120,
      loginKey: '',
      sessionKey: '',
      languageCode: 'en-us'
    };

    let registerFormData = {
      appKey: this.viaSurveyData.appKey,
      sendWelcomeEmailToUser: false,
      email: User.getUserId(), // We use the user id here in case the user email changes in the future, the userID will never change
      firstName: User.getFirstName(),
      lastName: User.getLastName(),
      gender: User.getGender(),
      password: this.createViaSurveyPassword(User.getFirstName(), User.getLastName())
    };

    this.getRegisterFormData = () => {
      return registerFormData;
    };

    this.displayNextPageSurvey = (iArgs) => {
      $log.warn('displayNextPageSurvey is CALLLED iArgs=', iArgs);
    };

    this.$onInit = () => {

      SpinnerFactory.show(SPINNERS.COURSE_CONTENT);

      ContentFactory.setNextStepButtonPreAction(this.displayNextPageSurvey, 1, 2, 3 );

      let registerUserPost = Data.viaSurvey();

      Object.assign(registerUserPost, this.getRegisterFormData());

      $log.warn('registerUserPost=', registerUserPost);

      registerUserPost.$register( (dataBackFromRegister) => {
        $log.log('Success registering dataBackFromRegister=', dataBackFromRegister);

        this.loginUserRequest();
      }, (error) => {

        // The user might have been already registered on the website, try to login if that's the case
        if ( error.status === 500 &&
             error.statusText === 'You have already registered a user with this email address' ) {
          $log.log('User already registered, proceed to login');
          this.loginUserRequest();
        }
        else {
          $log.error('Error during Register. error=', error);
          SpinnerFactory.hide(SPINNERS.COURSE_CONTENT);
        }
      });

      this.disableNextButton({ disableNextButton: true });
    };


    this.onUpdate = (iQuestionId, iValue) => {
      $log.log('onUpdate() - iQuestionId=', iQuestionId, '  iValue=', iValue);

      this.addAnswer(iQuestionId, iValue);

      let submitAnswerParams = {
        appKey: this.viaSurveyData.appKey,
        loginKey: this.viaSurveyData.loginKey,
        sessionkey: this.viaSurveyData.sessionKey,
        answers: [ {
          questionID: iQuestionId,
          choiceID: iValue
        } ]
      };


      let submitAnswersPost = Data.viaSurvey();
      Object.assign(submitAnswersPost, submitAnswerParams);
      submitAnswersPost.$submitAnswers( (dataBackFromSubmitAnswers) => {
        // If the SubmitAnswers service returns true, all answers have been submitted. If it returns false, more questions remain to
        // be answered and can be retrieved by a subsequent call to GetQuestions.
        $log.log('Success login dataBackFromSubmitAnswers=', dataBackFromSubmitAnswers);

      });


      for ( let radioQuestion of this.radioQuestions ) {
        for (let item of radioQuestion.data.items ) {
          if (item.selected) {
            $log.log(`Question ${radioQuestion.id}:  ${item.value} choice selected`);
          }
        }
      }

    };

    this.loginUserRequest = () => {
      let loginUserPost = Data.viaSurvey();
      Object.assign(loginUserPost, this.getRegisterFormData());
      loginUserPost.$login( (dataBackFromLogin) => {
        $log.log('Success login dataBackFromLogin=', dataBackFromLogin);

        this.viaSurveyData.loginKey = dataBackFromLogin.loginKey;

        this.startSurveyRequest();
      }, (error) => {
        $log.error('Error during Login, error=', error);

        SpinnerFactory.hide(SPINNERS.COURSE_CONTENT);
      });
    };

    this.startSurveyRequest = () => {
      let startSurveyParams = {
        appKey: this.viaSurveyData.appKey,
        loginKey: this.viaSurveyData.loginKey,
        surveyID: this.viaSurveyData.surveyID,
        languageCode: this.viaSurveyData.languageCode
      };


      let startSurveyPost = Data.viaSurvey();
      Object.assign(startSurveyPost, startSurveyParams);
      startSurveyPost.$startSurvey( (dataBackFromStartSurvey) => {
        $log.log('Success login dataBackFromStartSurvey=', dataBackFromStartSurvey);

        this.viaSurveyData.sessionKey = dataBackFromStartSurvey.sessionKey;
        this.getQuestionsRequest();
      }, (error) => {
        $log.error('Error during $startSurvey, error=', error);

        SpinnerFactory.hide(SPINNERS.COURSE_CONTENT);
      });
    };

    this.getQuestionsRequest = () => {
      let getQuestionsParams = {
        appKey: this.viaSurveyData.appKey,
        sessionkey: this.viaSurveyData.sessionKey,
        questionCount: this.viaSurveyData.questionCount
      };

      let getQuestionsPost = Data.viaSurvey();
      Object.assign(getQuestionsPost, getQuestionsParams);
      getQuestionsPost.$getQuestions( (dataBackFromGetQuestions) => {
        $log.log('Success login dataBackFromStartSurvey=', dataBackFromGetQuestions);
        this.radioQuestions = this.transformQuestionsToRadioBlock(dataBackFromGetQuestions.questionsList);
      }, (error) => {
        $log.error('Error during $getQuestions, error=', error);

        SpinnerFactory.hide(SPINNERS.COURSE_CONTENT);
      });

    };


    this.transformQuestionsToRadioBlock = (iQuestions) => {
      let radioListBlocks = [];
      for ( let question of iQuestions ) {
        let radioBlock = {
          id: question.QuestionID,
          type: 'dynamic',
          program_data_code: question.QuestionID, // eslint-disable-line camelcase
          data: {
            config: {
              required: true
            },
            label: `${question.QuestionNumber}: ${question.Text}`,
            placeholder: null,
            name: question.Text,
            items: []
          }
        };

        for (let answer of question.AnswerChoices ) {
          let item = {
            label: answer.Text,
            value: answer.ChoiceID,
            sub_label: null, // eslint-disable-line camelcase
            selected: false,
            feedback: null
          };

          radioBlock.data.items.push(item);
        }

        radioListBlocks.push(radioBlock);
      }

      return radioListBlocks;
    };

    this.startSurvey = () => {
      $log.log('Start survey');

      this.surveyStarted = true;
      this.disableNextButton({ disableNextButton: false });
    };

  }
}

export default ViaSurveyController;
