class BlockManagerController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'BlockManagerController' );

    this.$onInit = () => {
      this.blockData = this.block;
      $log.log('block manager');
    };

    this.onUpdate = (value) => {
      $log.log('onUpdateTest value=', value);
      this.updateParent({composedValue: value});
    };

  }
}

export default BlockManagerController;
