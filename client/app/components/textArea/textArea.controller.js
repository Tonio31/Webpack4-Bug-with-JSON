class TextAreaController {
  constructor($log, FORM_NAME_PREFIX) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'TextAreaController' );

    this.$onInit = () => {
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;
      $log.log( `New Form, formName=${this.formName}` );

      this.text = this.block.data.value;
    };

    // ng-model-options applied to the textarea
    this.modelOptions = {
      updateOn: 'default blur',
      debounce: {
        default: 500,
        blur: 0
      }
    };

    this.name = 'textArea';
  }
}

export default TextAreaController;
