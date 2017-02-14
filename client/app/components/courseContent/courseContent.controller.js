class CourseContentController {
  constructor($log,  $sce) {
    "ngInject";

    $log = $log.getInstance( "CourseContentController" );

    this.name = 'courseContent';

    this.$onInit = () => {
      $log.log("constructor()::$onInit - BEGIN");

      $log.log('dynamicContent=', this.dynamicContent );

      this.testtonio = $sce.trustAsHtml(this.dynamicContent.data.content);

      $log.log("constructor()::$onInit - END");
    };


    this.logDynamicContent = function() {
      $log.log('dynamicContent=', this.dynamicContent );
    }

  }
}

export default CourseContentController;
