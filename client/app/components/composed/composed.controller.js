class ComposedController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ComposedController' );

    this.$onInit = () => {
      this.blockData = this.block.blocks;
      $log.info('this.blockData', this.blockData);
    };
  }
}

export default ComposedController;
