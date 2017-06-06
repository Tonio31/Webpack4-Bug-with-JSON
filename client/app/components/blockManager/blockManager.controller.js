class BlockManagerController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'BlockManagerController' );

    this.onUpdate = (value) => {
      $log.log('onUpdate value=', value);
      this.updateParent({ parentValue: value });
    };
  }
}

export default BlockManagerController;
