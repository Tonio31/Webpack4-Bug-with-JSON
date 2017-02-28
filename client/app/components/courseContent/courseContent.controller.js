class CourseContentController {
  constructor($log, $filter, $state, Menu, Data) {
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

    this.previousStep = () => {
      $state.go(this.content.prev_page_url);
    };

    this.nextStep = () => {

      if ( !this.isStepCompleted ) {
        // First time user click on the button, display the green banner and change the label
        let postData = Data.updateStep({ stepid: this.content.id });

        postData.fullUrl = this.content.slug;
        postData.status = 'completed';

        postData.$save( (dataBackFromServer, postResponseHeadersFn) => {
          // user => saved user object
          // putResponseHeaders => $http header getter
          let postResponseHeadersObject = postResponseHeadersFn();

          // TONIO This will probably have to change to match whatever the real back end will send me
          if ( postResponseHeadersObject.status === 'ok' ) {

            $log.log('Response OK from the backend, retrieving the updated menu from backend');


            this.nextStepButtonLabel = $filter('translate')('NEXT').toString();
            this.isStepCompleted = true;
            this.displayCongratsBanner = true;

            // This will resend a query to the backend to get the menu, the status of the step
            // will be updated and the directive menuButton will update automatically the menu
            let forceMenuRetrieval = true;
            Menu.getMenuPromise(forceMenuRetrieval);

          }
          $log.log('dataBackFromServer=', dataBackFromServer);
          $log.log('postResponseHeadersObject=', postResponseHeadersObject);
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
