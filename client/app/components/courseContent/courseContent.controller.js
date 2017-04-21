class CourseContentController {

  // eslint-disable-next-line max-params
  constructor( $log,
               $filter,
               $location,
               $anchorScroll,
               $state,
               $stateRegistry,
               Menu,
               SpinnerFactory,
               Data,
               Utility,
               FORM_NAME_PREFIX,
               STATES,
               SPINNERS ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CourseContentController' );

    this.savingStepSpinner = SpinnerFactory.getSpinner(SPINNERS.SAVING_STEP);

    this.isStepCompleted = false;
    this.skipShowingBanner = false;

    // This container is used to store all the inputs modified by the user, so we can
    // send it back to the server when saving
    let inputFields = {};

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

    this.$onInit = () => {
      $log.log('$onInit - BEGIN');
      this.skipShowingBanner = this.content.skipShowingBanner;
      this.isStepCompleted = ( this.content.status === 'completed' );
      this.updateNextStepButtonStyle(this.isStepCompleted, this.skipShowingBanner, this.content.next_page_url);

      this.displayPreviousButton = ( this.content.prev_page_url !== null );

      $log.log('$onInit - END');
    };

    this.updateInputFields = (iIdentifier, iNewValue) => {
      $log.log('updateInputFields iIdentifier=', iIdentifier, '    iNewValue=', iNewValue);
      inputFields[iIdentifier] = iNewValue;
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


    this.convertInputFieldForPOST = (iInputFields) => {

      let programData = [];

      Object.entries(iInputFields).forEach( ([ key, value ]) => {
        programData.push({
          code: key,
          value: value
        });
      });

      return programData;
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
        postData.programData = this.convertInputFieldForPOST(inputFields);


        postData.$save( (dataBackFromServer) => {
          $log.log('Response OK from the backend, retrieving the updated menu from backend dataBackFromServer=', dataBackFromServer);

          // If there was user input saved in local storage, delete it as it has been successfully saved on server side
          Utility.removeUserInputFromLocalStorage(inputFields);

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

            this.isStepCompleted = true;
            this.updateNextStepButtonStyle(this.isStepCompleted, this.skipShowingBanner, this.content.next_page_url);

            if ( this.skipShowingBanner ) {
              // If we skip showing banner, we need to change state just after updating the menu
              $state.go(this.content.next_page_url);
            }
            else {
              this.setBannerSuccess(dataBackFromServer.congrats);
            }
          },
          (error) => {
            $log.log('error Retrieving menu error=', error);
            // Display error Banner for the user
            this.setBannerError();
          });

        }, (error) => {
          // Display error Banner for the user
          this.setBannerError();

          // Save user input to locasl storage so we can restore fit when he refresh the page
          Utility.saveUserInputToLocalStorage(inputFields);

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
