class TextAreaController {
  constructor($log, Utility, FORM_NAME_PREFIX, MODEL_OPTIONS) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'TextAreaController' );

    // ng-model-options applied to the textarea
    this.modelOptions = MODEL_OPTIONS;

    this.$onInit = () => {
      this.FORM_NAME = `${FORM_NAME_PREFIX}${this.block.id}`;

      if ( this.block.data.value ) {
        this.text = this.block.data.value;
      }
      else {
        this.text = Utility.getUserInputFromLocalStorage(this.block.program_data_code);
      }

      this.updateBlockManager({ blockManagerValue: this.text });
    };

    this.actionOnUserInput = () => {
      $log.log( `actionOnUserInput() - update courseContent: ${this.block.program_data_code}:${this.text}`);

      // Update parent with the change
      this.updateBlockManager({ blockManagerValue: this.text });
    };
  }
}

export default TextAreaController;
