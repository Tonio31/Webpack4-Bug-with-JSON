class CheckboxController {
  constructor($log, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CheckboxController' );

    this.name = 'checkbox';
    this.icons = ICON_FONTELLO;
    this.modelOptions = MODEL_OPTIONS;
    this.selection = {};

    this.$onInit = () => {
      $log.info('checkbox ', this);
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;
    };

    this.checkIfRequired = () => {
      for ( let [ key, value ] of Object.entries(this.selection) ) {
        if ( value === true ) {
          return false;
        }
      }
      return true;
    };

    this.actionOnUserInput = () => {
      let checkedInput = [];
      for ( let [ key, value ] of Object.entries(this.selection) ) {
        if ( value === true ) {
          checkedInput.push(key);
        }
      }
      this.onUpdate({ value: checkedInput });
    };

  }
}

export default CheckboxController;
