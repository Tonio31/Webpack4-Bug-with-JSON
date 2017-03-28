class CourseContentController {
  constructor($log, $filter, $location, $anchorScroll, $state, $stateRegistry, Menu, Data, FORM_NAME_PREFIX, STATES) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CourseContentController' );

    this.name = 'courseContent';

    this.isStepCompleted = false;
    this.congratsBannerText = '';

    this.errorBannerText = false;
    // this.errorBannerText = 'Error saving steps. Please <a href="#">save it here</a>.';

    this.updateStepCompleted = ( iIsStepCompleted, iNextState ) => {
      if ( iIsStepCompleted ) {
        this.isStepCompleted = true;
        if ( iNextState === STATES.HOME ) {
          this.nextStepButtonLabel = $filter('translate')('HOME').toString();
        }
        else {
          this.nextStepButtonLabel = $filter('translate')('NEXT').toString();
        }
      }
      else {
        this.isStepCompleted = false;
        this.nextStepButtonLabel = $filter('translate')('COMPLETE').toString();
      }
    };

    this.$onInit = () => {
      $log.log('$onInit - BEGIN');

      if ( this.content.status === 'current' ) {
        this.updateStepCompleted(false);
      }
      else if ( this.content.status === 'completed' ) {
        this.updateStepCompleted(true, this.content.next_page_url);
      }
      else {
        // We should never request a course for a locked module, throw an error if the status is not completed or current
        throw new Error(`Status of a step should always be current or completed. status=${this.content.status}`);
      }

      this.displayPreviousButton = ( this.content.prev_page_url !== null );

      $log.log('$onInit - END');
    };

    // This container is used to store all the inputs modified by the user, so we can send it back
    // to the server when saving
    let inputFields = {};
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

      if ( iForm.$invalid ) {
        this.goToFieldInError(iForm);
      }
      else if ( !this.isStepCompleted ) {
        // First time user click on the button, display the green banner and change the label
        let postData = Data.updateStep();

        postData.fullUrl = this.content.slug;
        postData.status = 'completed';
        postData.programData = this.convertInputFieldForPOST(inputFields);


        postData.$save( (dataBackFromServer) => {
          $log.log('Response OK from the backend, retrieving the updated menu from backend dataBackFromServer=', dataBackFromServer);

          this.updateStepCompleted(true, this.content.next_page_url);
          this.congratsBannerText = dataBackFromServer.congrats;

          // This will resend a query to the backend to get the menu, the status of the step
          // will be updated and the directive menuButton will update automatically the menu
          let forceMenuRetrieval = true;
          Menu.retrieveMenuAndReturnStates(forceMenuRetrieval).then( (states) => {
            // Modify state to check that state that are no more locked does not point to locked component
            $log.log('Menu updated successfully');
            states.forEach( (stateDefinition) => {
              let uiRouterState = $stateRegistry.get(stateDefinition.name);

              // Update Old Locked state to point to courseContent component
              if ( uiRouterState.component !== stateDefinition.component ) {
                $log.log(`About to deregister and re-register state ${stateDefinition.name}. uiRouterState=`, uiRouterState, '  stateDefinition=', stateDefinition);
                $stateRegistry.deregister(stateDefinition.name);
                $stateRegistry.register(stateDefinition);
              }
            });
          },
          (error) => {
            $log.log('error Retrieving menu error=', error);
          });

        }, (error) => {
          // Display error Banner for the user (to be defined with Matt how it will look like)
          // this.errorBannerText = dataBackFromServer.error;
          $log.log('Error saving the current step. error=', error);
        });
      }
      else {
        $state.go(this.content.next_page_url);
      }

    };
  }
}

export default CourseContentController;
