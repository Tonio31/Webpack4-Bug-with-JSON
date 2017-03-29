class BlockManagerController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'BlockManagerController' );

    this.onUpdate = (value) => {
      $log.log('onUpdateTest value=', value);
      this.updateParent({ composedValue: value });
    };

  }
}

export default BlockManagerController;
