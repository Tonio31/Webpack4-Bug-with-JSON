class TextBoxController {
  constructor($log, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'TextBoxController' );

    this.$onInit = () => {
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;

      this.iconText = ICON_FONTELLO.VALID_TICK;
      this.text = this.block.data.value;
    };


    this.actionOnUserInput = (iIsFormValid) => {
      $log.log( `actionOnUserInput() - update courseContent: ${this.block.program_data_code}:${this.text}` );

      // Update parent with the change
      this.onUpdate({ value: this.text });

      // Update the text that will change the icon (display exclamation mark if it's in error
      this.iconText = (iIsFormValid) ? ICON_FONTELLO.VALID_TICK : ICON_FONTELLO.WARNING;
    };

    // ng-model-options applied to the input
    this.modelOptions = MODEL_OPTIONS;
  }
}

export default TextBoxController;
