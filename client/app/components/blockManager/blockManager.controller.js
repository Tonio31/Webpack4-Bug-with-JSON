class BlockManagerController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'BlockManagerController' );

    this.onUpdate = (value) => {
      $log.log('onUpdate value=', value);
      this.updateParent({ parentValue: value });
    };

    this.disableNextButtonBM = (iDisable) => {
      $log.log('disableNextButtonBM iDisable=', iDisable);
      this.disableNextButton({ disableNextButton: iDisable });
    };

  }
}

export default BlockManagerController;
