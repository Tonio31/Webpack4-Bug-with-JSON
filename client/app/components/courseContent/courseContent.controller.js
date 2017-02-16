class CourseContentController {
  constructor($log, $sce, $state, Menu, Data, UserInfo) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CourseContentController' );

    this.name = 'courseContent';

    this.$onInit = () => {
      $log.log('constructor()::$onInit - BEGIN');

      $log.log('dynamicContent=', this.dynamicContent);

      this.testtonio = $sce.trustAsHtml(this.dynamicContent.data.content);

      $log.log('constructor()::$onInit - END');
    };


    this.nextStep = () => {
      let postData = Data.updateStep();

      postData.stepId = this.dynamicContent.data.id;
      postData.tokenId = UserInfo.getSecurityToken();

      postData.$save( (dataBackFromServer, postResponseHeadersFn) => {
        // user => saved user object
        // putResponseHeaders => $http header getter
        let postResponseHeadersObject = postResponseHeadersFn();

        // TONIO This will probably have to change to match whatever the real back end will send me
        if ( postResponseHeadersObject.status === 'ok' ) {

          $log.log('Response OK from the backend, retrieving the updated menu from backend');
          // This will resend a query to the backend to get the menu, the status of the step
          // will be updated and the directive menuButton will update automatically the menu
          let forceMenuRetrieval = true;
          Menu.getMenuPromise(forceMenuRetrieval).then( () => {
            // Successful retrieval of the menu updated with new status
            $state.go(Menu.getCurrentProgression().data.current_step.fullUrl);
          });

        }
        $log.log('dataBackFromServer=', dataBackFromServer);
        $log.log('postResponseHeadersObject=', postResponseHeadersObject);
      });

    };

  }
}

export default CourseContentController;
