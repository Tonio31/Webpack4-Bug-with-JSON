class CourseContentController {
  constructor($log, $filter, $location, $anchorScroll, $state, Menu, Data, FORM_NAME_PREFIX) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CourseContentController' );

    this.name = 'courseContent';

    this.isStepCompleted = false;


    this.$onInit = () => {
      $log.log('$onInit - BEGIN');

      if ( this.content.status === 'current' ) {
        this.isStepCompleted = false;
        this.nextStepButtonLabel = $filter('translate')('COMPLETE').toString();
      }
      else if ( this.content.status === 'completed' ) {
        this.isStepCompleted = true;
        this.nextStepButtonLabel = $filter('translate')('NEXT').toString();
      }
      else {
        // We should never request a course for a locked module, throw an error if the status is not completed or current
        throw new Error(`Status of a step should always be current or completed. status=${this.content.status}`);
      }

      this.displayPreviousButton = ( this.content.prev_page_url !== null );

      this.displayCongratsBanner = false;

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
             iForm[formName].hasOwnProperty(block.data.name) &&
             iForm[formName][block.data.name].$invalid ) {

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

          this.nextStepButtonLabel = $filter('translate')('NEXT').toString();
          this.isStepCompleted = true;
          this.displayCongratsBanner = true;

          // This will resend a query to the backend to get the menu, the status of the step
          // will be updated and the directive menuButton will update automatically the menu
          let forceMenuRetrieval = true;
          Menu.retrieveMenuAndReturnStates(forceMenuRetrieval);

        }, (error) => {
          // TODO Display error Banner for the user (to be defined with Matt how it will look like)
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
