class RadioListController {
  constructor($log, $scope, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'RadioListController' );

    this.name = 'radioList';
    this.icons = ICON_FONTELLO;
    this.modelOptions = MODEL_OPTIONS;
    this.selected = '';

    this.$onInit = () => {
      $log.info('radio ', this);
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;
    };

    this.actionOnUserInput = (iIsFormValid) => {
      this.onUpdate({ value: this.selected });
      $log.log(iIsFormValid);
    };

  }
}

export default RadioListController;
