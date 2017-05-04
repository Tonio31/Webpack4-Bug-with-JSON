class CourseContentController {

  // eslint-disable-next-line max-params
  constructor( $log,
               $filter,
               $location,
               $window,
               $anchorScroll,
               $state,
               $stateRegistry,
               Menu,
               SpinnerFactory,
               Data,
               Utility,
               ContentFactory,
               FORM_NAME_PREFIX,
               STATES,
               SPINNERS ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CourseContentController' );

    this.savingStepSpinner = SpinnerFactory.getSpinner(SPINNERS.SAVING_STEP);

    this.isStepCompleted = false;
    this.skipShowingBanner = false;

    this.banner = {
      text: '',
      class: '',
      icon: ''
    };

    this.nextStepButton = {
      label: '',
      class: ''
    };

    this.setBannerSuccess = ( iSuccessMessage) => {
      this.banner.text = iSuccessMessage;
      this.banner.class = 'banner-congrats';
      this.banner.icon = 'icon-pl-tick';
      SpinnerFactory.hide(SPINNERS.SAVING_STEP);
    };

    this.setBannerError = () => {
      this.banner.text = `<p>${ $filter('translate')('ERROR_SAVING_RETRY').toString() }</p>`;
      this.banner.class = 'banner-error';
      this.banner.icon = 'icon-pl-exclamation';
      SpinnerFactory.hide(SPINNERS.SAVING_STEP);
    };

    this.updateNextStepButtonStyle = (iIsStepCompleted, iSkipShowingBanner, iNextState ) => {
      if ( iIsStepCompleted || iSkipShowingBanner ) {
        this.nextStepButton.class = 'primary';
        if ( iNextState === STATES.HOME ) {
          this.nextStepButton.label = $filter('translate')('HOME').toString();
        }
        else {
          this.nextStepButton.label = $filter('translate')('NEXT').toString();
        }
      }
      else {
        this.nextStepButton.class = 'success';
        this.nextStepButton.label = $filter('translate')('COMPLETE').toString();
      }
    };

    this.calculateButtonInfo = (iIsStepCompleted, iSkipShowingBanner, iNextState, iPreviousState) => {

      if ( iPreviousState ) {
        this.displayPreviousButton = true;
      }
      else {
        this.displayPreviousButton = false;
      }

      if ( iNextState ) {
        this.displayNextButton = true;
        this.updateNextStepButtonStyle(iIsStepCompleted, iSkipShowingBanner, iNextState);
      }
      else {
        this.displayNextButton = false;
      }


    };

    this.$onInit = () => {
      $log.log('$onInit - BEGIN');
      this.skipShowingBanner = this.content.skipShowingBanner;
      this.isStepCompleted = ( this.content.status === 'completed' );
      this.calculateButtonInfo( this.isStepCompleted,
                                this.skipShowingBanner,
                                this.content.next_page_url,
                                this.content.prev_page_url );

      ContentFactory.clearInputFields();
      $log.log('$onInit - END');
    };

    this.updateInputFields = (iIdentifier, iNewValue) => {
      ContentFactory.updateInputFields(iIdentifier, iNewValue);
    };

    this.previousStep = () => {
      $state.go(this.content.prev_page_url);
    };

    this.goToFieldInError = (iForm) => {
      for ( let block of this.content.blocks ) {
        let formName = `${FORM_NAME_PREFIX}${block.id}`;

        if ( iForm.hasOwnProperty(formName) &&
             iForm[formName].$invalid ) {

          // Focus the user on the form in error
          $location.hash(block.data.name);
          $anchorScroll();
          return;
        }
      }
    };


    this.convertInputFieldForPOST = (iInputFields, iAdditionalData) => {

      let programData = [];

      Object.entries(iInputFields).forEach( ([ key, value ]) => {
        programData.push({
          code: key,
          value: value
        });
      });

      Object.entries(iAdditionalData).forEach( ([ key, value ]) => {
        programData.push({
          code: key,
          value: value
        });
      });

      return programData;
    };

    this.actionsAfterSaveSuccessful = (iBannerCongratsMsg) => {
      this.isStepCompleted = true;
      this.updateNextStepButtonStyle(this.isStepCompleted, this.skipShowingBanner, this.content.next_page_url);

      if ( this.skipShowingBanner ) {
        // If we skip showing banner, we need to change state just after updating the menu
        $state.go(this.content.next_page_url);
      }
      else {
        this.setBannerSuccess(iBannerCongratsMsg);
      }
    };

    this.nextStep = (iForm) => {
      if ( iForm.$invalid && !this.isStepCompleted ) {
        this.goToFieldInError(iForm);
      }
      else if ( !this.isStepCompleted || this.skipShowingBanner ) {
        // First time user click on the button, display the green banner,
        // change the label and display the spinner

        SpinnerFactory.show(SPINNERS.SAVING_STEP);

        let postData = Data.updateStep();

        postData.fullUrl = this.content.fullUrl;
        postData.status = 'completed';
        postData.programData = this.convertInputFieldForPOST(ContentFactory.getInputFields(), ContentFactory.getAdditionalData());

        postData.$save( (dataBackFromServer) => {
          $log.log('Response OK from the backend, retrieving the updated menu from backend dataBackFromServer=', dataBackFromServer);

          // User has successfully completed a step
          $window.ga('send', {
            hitType: 'event',
            eventCategory: 'CompletedStep',
            eventAction: this.content.fullUrl,
            eventLabel: this.content.name
          });

          // If there was user input saved in local storage, delete it as it has been successfully saved on server side
          Utility.removeUserInputFromLocalStorage(ContentFactory.getInputFields());

          if ( Menu.isMenuRetrieved() ) {
            // This will resend a query to the backend to get the menu, the status of the step
            // will be updated and the directive menuButton will update automatically the menu
            Menu.retrieveMenuAndReturnStates().then( (states) => {
              // Modify state to check that state that are no more locked does not point to locked component
              $log.log('Menu updated successfully');
              states.forEach( (stateDefinition) => {
                let uiRouterState = $stateRegistry.get(stateDefinition.name);

                // Update Old Locked state to point to courseContent component
                if ( uiRouterState && uiRouterState.component !== stateDefinition.component ) {
                  $log.log(`About to deregister and re-register state ${stateDefinition.name}. uiRouterState=`, uiRouterState, '  stateDefinition=', stateDefinition);
                  $stateRegistry.deregister(stateDefinition.name);
                  $stateRegistry.register(stateDefinition);
                }
              });

              this.actionsAfterSaveSuccessful(dataBackFromServer.congrats);
            },
            (error) => {
              $log.log('error Retrieving menu error=', error);
              // Display error Banner for the user
              this.setBannerError();
            });
          }
          else {
            this.actionsAfterSaveSuccessful(dataBackFromServer.congrats);
          }
        }, (error) => {
          // Display error Banner for the user
          this.setBannerError();

          // Save user input to locasl storage so we can restore fit when he refresh the page
          Utility.saveUserInputToLocalStorage(ContentFactory.getInputFields());

          $log.log('Error saving the current step. error=', error);
        });
      }
      else {
        $log.info('About to change state to go to: ', this.content.next_page_url);
        $state.go(this.content.next_page_url);
      }

    };

  }
}

export default CourseContentController;
