class TextAreaController {
  constructor($log, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'TextAreaController' );

    this.icons = ICON_FONTELLO;

    // ng-model-options applied to the textarea
    this.modelOptions = MODEL_OPTIONS;

    this.$onInit = () => {
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;

      this.text = this.block.data.value;
      this.iconText = ICON_FONTELLO.VALID_TICK;
    };

    this.actionOnUserInput = (iIsFormValid) => {
      $log.log( `actionOnUserInput() - update courseContent: ${this.block.program_data_code}:${this.text}`,
      'iIsFormValid: ', iIsFormValid);

      // Update parent with the change
      this.onUpdate({ value: this.text });
    };
  }
}

export default TextAreaController;
