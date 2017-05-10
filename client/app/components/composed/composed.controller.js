class ComposedController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ComposedController' );

    this.$onInit = () => {
      this.blockData = this.block.data.blocks;
      $log.info('this.blockData', this.blockData);
    };

    this.onUpdate = (iProgramDataCode, value) => {
      $log.log('onUpdate value=', value);
      this.updateParent({
        courseContentValue: value,
        programDataCode: iProgramDataCode
      });
    };
  }
}

export default ComposedController;
