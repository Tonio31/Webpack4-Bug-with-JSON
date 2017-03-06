class PageNotFoundController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'PageNotFoundController' );

    $log.log('PageNotFound - Initialization');
  }
}

export default PageNotFoundController;
