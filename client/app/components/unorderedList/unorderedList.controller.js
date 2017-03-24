class UnorderedListController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'UnorderedListController' );

    this.$onInit = () => {
      this.blockData = this.block.data;
      $log.info('this.blockData', this.blockData);
    };

  }
}

export default UnorderedListController;
