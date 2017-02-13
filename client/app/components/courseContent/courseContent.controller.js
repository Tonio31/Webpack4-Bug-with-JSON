class CourseContentController {
  constructor($log) {
    "ngInject";

    $log = $log.getInstance( "CourseContentController" );

    this.name = 'courseContent';

    $log.log('CourseContentController:: data=', this.data );
    $log.log('CourseContentController:: content=', this.content );


  }
}

export default CourseContentController;
