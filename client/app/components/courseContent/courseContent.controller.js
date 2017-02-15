class CourseContentController {
  constructor($log, $sce, Data) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CourseContentController' );

    this.name = 'courseContent';

    this.$onInit = () => {
      $log.log('constructor()::$onInit - BEGIN');

      $log.log(`dynamicContent=${this.dynamicContent}`);

      this.testtonio = $sce.trustAsHtml(this.dynamicContent.data.content);

      $log.log('constructor()::$onInit - END');
    };


    this.nextStep = () => {
      let postData = Data.updateStep();

      postData.stepId = 'something to send';

      postData.$save( (user, postResponseHeadersFn) => {
        // user => saved user object
        // putResponseHeaders => $http header getter
        let postResponseHeadersObject = postResponseHeadersFn();


        $log.log('user=', user);
        $log.log('postResponseHeadersObject=', postResponseHeadersObject);
      });

    };

  }
}

export default CourseContentController;
