class RadioListController {
  constructor($log, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'RadioListController' );


    this.name = 'radioList';
    this.icons = ICON_FONTELLO;
    this.modelOptions = MODEL_OPTIONS;
    this.selected = '';

    this.$onInit = () => {
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;

      this.text = this.block.data.value;
    };

    this.actionOnUserInput = (iIsFormValid) => {
      this.onUpdate({ value: this.selected, checked: true });
      $log.log('actionOnUserInput() - iIsFormValid=', iIsFormValid);
    };

  }
}

export default RadioListController;
