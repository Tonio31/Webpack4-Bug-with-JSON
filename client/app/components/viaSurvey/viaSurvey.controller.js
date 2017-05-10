class ViaSurveyController {
  // eslint-disable-next-line max-params
  constructor( $log,
               $q,
               $state,
               $anchorScroll,
               $filter,
               User,
               Data,
               ContentFactory,
               SpinnerFactory,
               Utility,
               LanguageFactory,
               SPINNERS,
               STATES,
               WEBSITE_CONFIG ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ViaSurveyController' );

    $log.log('constructor - START');

    this.viaSurveyData = {
      appKey: WEBSITE_CONFIG.viaSurvey.appKey,
      surveyID: WEBSITE_CONFIG.viaSurvey.surveyID,
      questionCount: WEBSITE_CONFIG.viaSurvey.questionCount,
      loginKey: '',
      sessionKey: '',
      languageCode: LanguageFactory.getCurrentLanguageForViaSurvey()
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

    this.$onInit = () => {

      $log.log('onInit() - BEGIN');

      this.radioQuestions = [];


      this.tabToDisplay = 'questions';

      this.simulateTopLevelFormSubmitted = [];
      for ( let page = 1; page <= this.nbPagesSurvey; page++ ) {
        this.simulateTopLevelFormSubmitted[page] = false;
      }

      this.isListOfStrengthFormSubmitted = false;

      if ( this.block.config.nb_questions_per_page &&
        this.block.config.nb_questions_per_page > 0 &&
        this.block.config.nb_questions_per_page <= 120 ) {
        this.nbQuestionsDisplayed = this.block.config.nb_questions_per_page;
      }
      else {
        this.nbQuestionsDisplayed = 10; // Default value if the input is messed up
      }

      this.numFirstQuestionDisplayed = 0;
      this.nbPagesSurvey = Math.floor( WEBSITE_CONFIG.viaSurvey.questionCount / this.nbQuestionsDisplayed );
      this.currentPageNumber = 1;

      SpinnerFactory.show(SPINNERS.COURSE_CONTENT);

      ContentFactory.setBeforeNextStepValidation(this.setTopLevelFormSubmitted);
      ContentFactory.setNextStepButtonPreSaveAction(this.displayNextPageSurvey);
      ContentFactory.setPreviousStepButtonPreAction(this.displayPrevPageSurvey);

      this.registerUser();

      $log.log('onInit() - END');
    };

    this.displayPrevPageSurvey = () => {
      if ( this.currentPageNumber === 0 || this.currentPageNumber > this.nbPagesSurvey ) {
        $state.go(this.navigation.prevPage);
      }
      else {
        this.currentPageNumber -= 1;
        this.numFirstQuestionDisplayed -= this.nbQuestionsDisplayed;
      }
    };

    this.createViaSurveyPassword = (iFirstName, iLastName) => {
      return `${iFirstName}!@#$%${iLastName}`;
    };

    this.goToErrorState = (iApiInError, iError) => {
      $log.error(`Error during ${iApiInError}. error=`, iError);
      SpinnerFactory.hide(SPINNERS.COURSE_CONTENT);
      $state.go(STATES.ERROR_PAGE, { errorMsg: 'ERROR_UNEXPECTED' }, { reload: true });
    };

    // This function will be called every time the user clicks on "Next Step" button at the bottom of the page
    // It is registered via ContentFactory.setBeforeNextStepValidation(this.setTopLevelFormSubmitted)
    this.setTopLevelFormSubmitted = () => {
      if ( this.tabToDisplay === 'questions' ) {
        this.simulateTopLevelFormSubmitted[this.currentPageNumber] = true;
      }
      else if ( this.tabToDisplay === 'results' ) {
        this.isListOfStrengthFormSubmitted = true;
      }
    };

    this.displayNextPageSurvey = () => {
      $log.warn( `displayNextPageSurvey this.currentPageNumber=${this.currentPageNumber},   this.nbPagesSurvey=${this.nbPagesSurvey}` );

      if ( this.currentPageNumber <= this.nbPagesSurvey ) {
        this.numFirstQuestionDisplayed += this.nbQuestionsDisplayed;
        this.currentPageNumber += 1;
        Utility.saveUserInputToLocalStorage(ContentFactory.getInputFields());
      }

      if ( this.currentPageNumber === this.nbPagesSurvey + 1 ) {
        // Survey is finished ( currentPageNumber starts at 0 when nbPagesSurvey is the total number of pages)
        $log.log('This is the last page of the survey this.currentPageNumber=', this.currentPageNumber);
        SpinnerFactory.show(SPINNERS.COURSE_CONTENT);
        this.submitAnswers().then( (iAllAnswerSubmitted) => {
          if (iAllAnswerSubmitted.data) {
            $log.log('all answer have been submitted, getting the results of the survey');
            this.getResults();
          }
          else {
            $log.log('Not all answer have been submitted, this should never happen');
            this.goToErrorState('submitAnswers - reply false');
          }
        });
      }

      $anchorScroll('main');
    };



    this.onUpdate = (iQuestionId, iValue) => {
      $log.log('onUpdate() - iQuestionId=', iQuestionId, '  iValue=', iValue);
      ContentFactory.updateInputFields(iQuestionId, iValue);
    };

    this.transformResultsToCheckBoxBlock = (iListStrengths) => {
      $log.log('transformResultsToCheckBoxBlock() - iListStrengths=', iListStrengths);
      let checkboxBlock = {
        id: 52,
        type: 'dynamic',
        element: 'checkbox',
        program_data_code: this.block.config.match_strength_data_code, // eslint-disable-line camelcase
        data: {
          config: {
            min_selected: 3, // eslint-disable-line camelcase
            max_selected: 3 // eslint-disable-line camelcase
          },
          label: $filter('translate')('YOUR_CHARACTER_STRENGTHS').toString(),
          placeholder: '',
          name: '',
          items: []
        }
      };

      for (let strength of iListStrengths) {
        let item = {
          label: strength.StrengthName,
          sub_label: strength.StrengthDescription, // eslint-disable-line camelcase
          value: strength.StrengthName,
          checked: false,
          feedback: null
        };
        checkboxBlock.data.items.push(item);
      }

      $log.log('transformResultsToCheckBoxBlock() - checkboxBlock=', checkboxBlock);

      return checkboxBlock;

    };

    this.saveSurveyResultToBackEnd = (iListOfStrength) => {

      let saveSurveyResultsPost = Data.partialUpdateStep();
      saveSurveyResultsPost[this.block.config.all_strengths] = iListOfStrength;

      saveSurveyResultsPost.$save( (dataBackFromServer) => {
        $log.log('Success saving list of Strength to the back end.  dataBackFromServer=', dataBackFromServer);
      },
      (error) => {
        $log.error('Error while saving list of Strength error=', error);

        // Saving the list of strength to the server is not mandatory at this stage
        // If this fail now, we will try to add it to the list of fields to be saved later as part of the normal process within courceController.nextStep()
        ContentFactory.updateInputFields(this.block.config.all_strengths, iListOfStrength);
      });

    };

    this.getResults = () => {
      let getResultsParams = {
        appKey: this.viaSurveyData.appKey,
        loginKey: this.viaSurveyData.loginKey,
        sessionkey: this.viaSurveyData.sessionKey
      };

      let getResultsPost = Data.viaSurvey('GetResults');
      Object.assign(getResultsPost, getResultsParams);
      getResultsPost.$call( (dataBackFromGetResults) => {
        $log.log('getResults() - Success dataBackFromGetResults=', dataBackFromGetResults);
        this.saveSurveyResultToBackEnd(dataBackFromGetResults.data);

        this.listOfStrengthsForCheckBox = this.transformResultsToCheckBoxBlock(dataBackFromGetResults.data);
        ContentFactory.clearInputFields();
        this.tabToDisplay = 'results';


        // Remove the special action before saving step
        ContentFactory.setNextStepButtonPreSaveAction(undefined);

        $log.log('getResults() - Success - Before Hiding spinner');
        SpinnerFactory.hide(SPINNERS.COURSE_CONTENT);
      }, (error) => {
        this.goToErrorState('GetResults', error);
      });
    };

    this.submitAnswers = () => {
      let deferred = $q.defer();
      let submitAnswerParams = {
        appKey: this.viaSurveyData.appKey,
        loginKey: this.viaSurveyData.loginKey,
        sessionkey: this.viaSurveyData.sessionKey,
        answers: []
      };

      Object.entries(ContentFactory.getInputFields()).forEach( ([ key, value ]) => {
        submitAnswerParams.answers.push({
          questionID: key,
          choiceID: value
        });
      });

      let submitAnswersPost = Data.viaSurvey('SubmitAnswers');
      Object.assign(submitAnswersPost, submitAnswerParams);
      submitAnswersPost.$call( (dataBackFromSubmitAnswers) => {
        // If the SubmitAnswers service returns true, all answers have been submitted. If it returns false,
        // more questions remain to be answered and can be retrieved by a subsequent call to GetQuestions.
        $log.log('Success submitAnswer dataBackFromSubmitAnswers=', dataBackFromSubmitAnswers);
        deferred.resolve(dataBackFromSubmitAnswers);
      }, (error) => {
        this.goToErrorState('SubmitAnswers', error);
        deferred.reject(error);
      });

      return deferred.promise;
    };

    this.registerUser = () => {
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
          this.goToErrorState('Register', error);
        }
      });
    };

    this.loginUserRequest = () => {
      let loginUserPost = Data.viaSurvey('LoginUser');
      Object.assign(loginUserPost, this.getRegisterFormData());
      loginUserPost.$call( (dataBackFromLogin) => {
        $log.log('Success login dataBackFromLogin=', dataBackFromLogin);

        this.viaSurveyData.loginKey = dataBackFromLogin.data;

        this.startSurveyRequest();
      }, (error) => {
        this.goToErrorState('Login', error);
      });
    };

    this.startSurveyRequest = () => {
      let startSurveyParams = {
        appKey: this.viaSurveyData.appKey,
        loginKey: this.viaSurveyData.loginKey,
        surveyID: this.viaSurveyData.surveyID,
        languageCode: this.viaSurveyData.languageCode
      };


      let startSurveyPost = Data.viaSurvey('StartSurvey');
      Object.assign(startSurveyPost, startSurveyParams);
      startSurveyPost.$call( (dataBackFromStartSurvey) => {
        $log.log('Success StartSurvey dataBackFromStartSurvey=', dataBackFromStartSurvey);

        this.viaSurveyData.sessionKey = dataBackFromStartSurvey.data;
        this.getQuestionsRequest();
      }, (error) => {
        this.goToErrorState('StartSurvey', error);
      });
    };

    this.calculateCurrentPageNumber = () => {
      $log.log('calculateCurrentPageNumber() - START');
      for ( let questionIndex = 0; questionIndex < this.radioQuestions.length; questionIndex++ ) {
        let questionId = this.radioQuestions[questionIndex].program_data_code;
        if ( !Utility.getUserInputFromLocalStorage(questionId) ) {
          // We found the first unanswered question
          this.currentPageNumber = Math.floor( questionIndex / this.nbQuestionsDisplayed ) + 1;
          this.numFirstQuestionDisplayed = (this.currentPageNumber - 1) * this.nbQuestionsDisplayed;
          $log.log( `First Unanswered question at index=${questionIndex},  this.currentPageNumber=${this.currentPageNumber},    this.numFirstQuestionDisplayed=${this.numFirstQuestionDisplayed}`);
          return;
        }
      }
    };

    this.getQuestionsRequest = () => {
      let getQuestionsParams = {
        appKey: this.viaSurveyData.appKey,
        sessionkey: this.viaSurveyData.sessionKey,
        questionCount: this.viaSurveyData.questionCount
      };

      let getQuestionsPost = Data.viaSurvey('GetQuestions');
      Object.assign(getQuestionsPost, getQuestionsParams);
      getQuestionsPost.$call( (dataBackFromGetQuestions) => {
        $log.log('Success GetQuestions dataBackFromGetQuestions=', dataBackFromGetQuestions);
        this.radioQuestions = this.transformQuestionsToRadioBlock(dataBackFromGetQuestions.data);
        this.calculateCurrentPageNumber();
        SpinnerFactory.hide(SPINNERS.COURSE_CONTENT);
      }, (error) => {
        this.goToErrorState('GetQuestions', error);
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
            selected: true, // TODO change this to false as this pre-select the first item for every radio
            feedback: null
          };

          radioBlock.data.items.push(item);
        }

        radioListBlocks.push(radioBlock);
      }

      return radioListBlocks;
    };

  }
}

export default ViaSurveyController;
